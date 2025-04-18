import { MONGO_CLIENT_EVENTS } from "mongodb";
import clientPromise from ".";

let client;
let db;
let products;

async function init() {
    if (db) return
    try {
        client = await clientPromise;
        db = await client.db('marshmallow');
        products = await db.collection('products');
    } catch (error) {
        throw new Error('Failed to stablish connection to database')
    }
}

;(async () => {
    await init()
})()

// products

export async function getProducts() {
    try {
        if (!products) await init();
        const result = await products
            .find({})
            .limit(20)
            .map(user => ({ ...user, _id: user._id.toString() }))
            .toArray()

        return { products: result }
    } catch (error) {
        return { error: 'Failed to fetch products' }
    }
}