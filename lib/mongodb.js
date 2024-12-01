import { MongoClient } from 'mongodb';

let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(process.env.DB_ADDRESS);
    clientPromise = client.connect();
    global._mongoClientPromise = clientPromise;
} else {
    clientPromise = global._mongoClientPromise;
}

export default async function connectToDatabase() {
    const client = await clientPromise;
    const db = client.db('app'); // Replace 'app' with the name of your database
    return db;
}
