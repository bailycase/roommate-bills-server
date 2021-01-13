import Mongo, { MongoClient } from 'mongodb'
const setupDb = async () => {
    let db: Mongo.Db;
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true })
        db = client.db('motivateme')
        return db
    }
    catch (e) {
        console.error(e)
    }
}

export default setupDb