import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;  // Set your MongoDB Atlas connection string as an environment variable

// Function to fetch attacks from MongoDB with pagination
async function fetchAttacks(page = 1, limit = 10) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('honeypot');
    const collection = db.collection('attacks');

    const attacks = await collection
      .find({})
      .sort({ timestamp: -1 }) // Sort by most recent
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments(); // Get total count of documents

    await client.close();

    return { attacks, total };
  } catch (error) {
    console.error('Error fetching attacks from database:', error);
    throw error;
  }
}

export async function GET(req) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 10;

  try {
    const { attacks, total } = await fetchAttacks(page, limit);

    return NextResponse.json({ attacks, total, page, limit });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attacks' }, { status: 500 });
  }
}
