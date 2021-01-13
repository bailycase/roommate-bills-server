import { UserInputError } from "apollo-server-fastify";
import { MutationLoginArgs } from "../../../generated/graphql";
import { checkHash } from "../../../utils/hash";
import { ObjectID } from "mongodb";
import { add } from 'date-fns'
import { generateTokens } from "../../../utils/generateTokens";


interface User {
    _id: ObjectID;
    email: string;
    password: string;
}

const loginUser = async (_: any, args: MutationLoginArgs, context: GraphQLModules.Context) => {
    const { email, password } = args
    const { db, request, reply } = context
    const userCollection = db.collection('users')

    const user = await userCollection.findOne<User>({ email })

    if (!user) throw new UserInputError('No account with that email was found')
    const passwordMatches = await checkHash(password, user.password)

    if (!passwordMatches) throw new UserInputError('Password does not match that email')

    const { refreshToken, accessToken } = generateTokens(user)
    const currentDate = new Date()
    reply.setCookie('refresh-token', refreshToken, { expires: add(currentDate, { weeks: 1 }) })
    reply.setCookie('access-token', accessToken, { expires: add(currentDate, { weeks: 1 }) })

    return {
        email: user.email
    }
}

export default loginUser