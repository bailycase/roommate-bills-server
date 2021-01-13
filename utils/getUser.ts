import { Db, ObjectID } from "mongodb";

const getUser = async (userId: string, db: Db) => {
    const userCollection = db.collection('users')
    const user = await userCollection.findOne({ _id: new ObjectID(userId) })

    return user;
}

export default getUser