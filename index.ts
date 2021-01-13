import { ApolloServer } from 'apollo-server-fastify'
import cookie from 'cookie'
import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from 'fastify-cors'
import FastifyCookie, { FastifyCookieOptions } from 'fastify-cookie'
import { verify } from 'jsonwebtoken'
import Middie from 'middie'
import setupDb from './utils/setupDb'
import { generateTokens } from './utils/generateTokens'
import { add } from 'date-fns'
import { ModuleApplication } from './gql-modules/moduleApplication'
import { ObjectID } from 'mongodb'
import getUser from './utils/getUser'
require('dotenv').config()


interface ApolloServerContext {
    request: FastifyRequest;
    reply: FastifyReply & FastifyCookieOptions
}
// apollo server
const schema = ModuleApplication.createSchemaForApollo()


const server = new ApolloServer({
    schema,
    context: async ({ request, reply }: ApolloServerContext) => {
        const db = await setupDb()
        let user = null
        if (request.raw.userId && db) {
            const userId = request.raw.userId
            user = await getUser(userId, db);
        }
        return { db, request, reply, user }
    }
});

const start = async () => {
    const app = Fastify();
    const db = await setupDb();

    if (!db) throw new Error('Mongo is not working')

    await app.register(cors, {
        credentials: true, origin: 'http://localhost:3000'
    })
    await app.register(Middie);
    await app.register(FastifyCookie, { secret: process.env.JWT_SECRET });

    app.use(async (req, reply, next) => {
        if (req.headers && req.headers.cookie && req.headers.cookie.length !== 0) {
            const cookies = cookie.parse(req.headers.cookie)
            const accessToken = cookies['access-token']
            const refreshToken = cookies['refresh-token']
            if (!accessToken && !refreshToken) return next()
            try {
                const data = verify(accessToken, process.env.JWT_SECRET!) as any
                (req as any).userId = data.userId
                return next()
            } catch { }
            if (!refreshToken) {
                return next()
            }
            let data;

            try {
                data = verify(refreshToken, process.env.JWT_SECRET!) as any
            }
            catch {
                return next()
            }

            const userCollection = db.collection('users')
            const user = await userCollection.findOne({ _id: new ObjectID(data.userId) })

            if (!user) return next()
            const tokens = generateTokens(user)

            const currentDate = new Date()

            reply.setHeader('Set-Cookie', cookie.serialize('refresh-token', tokens.refreshToken, { expires: add(currentDate, { weeks: 1 }) }))
            reply.setHeader('Set-Cookie', cookie.serialize('access-token', tokens.accessToken, { expires: add(currentDate, { weeks: 1 }) }))
            req.userId = user._id
        }
        next()
    })

    app.register(server.createHandler({ cors: false }));
    return app
};


start().then(fastify => fastify.listen(4000)).catch(console.log)
