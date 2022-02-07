import { MongoClient } from 'mongodb'

export const connectDatabase = async () => {
	return await new MongoClient(process.env.DATABASE_URL).connect()
}
