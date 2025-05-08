
import { connectToDatabase } from '@/lib/mongo/index';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const products = await db.collection("products").find().limit(100).toArray();

  res.status(200).json(products);
}

