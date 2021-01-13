import { ObjectID } from "mongodb"

const Me = async (_: any, args: any, context: GraphQLModules.Context) => {
    const { request: { raw }, db } = context
    if (!raw.userId) return null

    const userCollection = db.collection('users')
    const self = await userCollection.findOne({ _id: new ObjectID(raw.userId) })

    return {
        userId: self._id,
        ...self
    }
}

export default Me