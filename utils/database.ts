// utils/database.ts
import { MongoClient, Db } from 'mongodb';

const uri = 'mongodb+srv://dbadmin:dbpassword@acr.8zayo1z.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db: Db;

export async function connectToDatabase() {
  if (!client.isConnected()) {
    await client.connect();
  }
  db = client.db('acr'); // Replace with your database name
  return { db, client };
}
