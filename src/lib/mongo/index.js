import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};


let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Не указана переменная окружения MONGODB_URI');
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await global._mongoClientPromise;
  const db = client.db();
  return { client, db };
}