import { UserInputError } from 'apollo-server-fastify'
import Validator from 'fastest-validator'
import { checkHash, hash } from '../../../utils/hash'
import { MutationRegisterArgs } from '../../../generated/graphql'

const validator = new Validator()
const schema = {
    email: { type: 'email' },
    password: { type: 'string', min: 6, max: 30 }
}
const check = validator.compile(schema)
const registerUser = async (parent: any, args: MutationRegisterArgs, context: GraphQLModules.Context) => {
    const { email, password } = args
    const isValid = check({ email, password })
    if (isValid !== true) {
        throw new UserInputError('Password must be longer than 6 characters')
    }
    const { db } = context
    const userCollection = db.collection('users')
    const userExists = await userCollection.findOne({ email })
    if (userExists) throw new UserInputError('An account with that email already exists')

    const hashedPassword = await hash(password)

    userCollection.insertOne({ email, password: hashedPassword })

    return { email }

}

export default registerUser