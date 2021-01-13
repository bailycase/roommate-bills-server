import Mongo from 'mongodb'
import { FastifyReply, FastifyRequest } from 'fastify'
import { FastifyCookieOptions } from 'fastify-cookie'
import { Name } from '../generated/graphql'
// declare namespace GraphQLModules {
//     interface GlobalContext {
//         request: any;
//     }
// }

type User = {
    _id: string
    email: string
    password: string
    name: Name
}
declare global {
    namespace GraphQLModules {
        interface GlobalContext {
            request: FastifyRequest;
            db: Mongo.Db;
            reply: FastifyReply & FastifyCookieOptions;
            user: User
        }
    }
}