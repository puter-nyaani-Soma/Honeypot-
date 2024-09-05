import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import useragent from 'useragent';

const uri = process.env.MONGODB_URI;  // Set your MongoDB Atlas connection string as an environment variable

// Function to log data into MongoDB
async function logToDatabase(attackerDetails, type) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('honeypot');
    const collection = db.collection('attacks');

    await collection.insertOne({
      ...attackerDetails,
      type,  // Log the type of attack (sql-injection, xss, etc.)
    });

    await client.close();
  } catch (error) {
    console.error('Error logging to database:', error);
  }
}

// Function to extract alert message from XSS payload
function extractAlertMessage(input) {
  const match = input.match(/<script>alert\((.*)\)<\/script>/);
  return match ? match[1] : null;
}

// Function to parse User-Agent
function parseUserAgent(userAgentString) {
  const agent = useragent.parse(userAgentString);
  return {
    browser: `${agent.family} ${agent.major}.${agent.minor}`,
    os: `${agent.os.family} ${agent.os.major}.${agent.os.minor}`,
    device: agent.device.family,
  };
}

export async function POST(req) {
  const formData = await req.formData();
  const input = formData.get('input');

  // Capture attacker details
  const userAgentString = req.headers.get('user-agent') || 'N/A';
  const parsedUserAgent = parseUserAgent(userAgentString);

  const attackerDetails = {
    ip: req.headers.get('x-forwarded-for') || req.ip, // Get IP Address
    userAgent: userAgentString, // Get User-Agent
    parsedUserAgent, // Add parsed User-Agent details
    input: input, // Get the input data from the form
    timestamp: new Date(), // Capture the current timestamp
    referrer: req.headers.get('referer') || 'N/A', // Get Referrer URL
    // Add any other details you can capture, such as location info from IP
  };

  // Basic SQL Injection Simulation
  if (input.includes('SELECT') || input.includes('UNION')) {
    console.log('Potential SQL Injection Attempt:', attackerDetails);

    // Log the attempt to MongoDB
    await logToDatabase(attackerDetails, 'sql-injection');

    // Respond with fake data
    const fakeData = [
      { user: 'admin', password: 'admin123', session_token: 'fake-session-token' },
      // Add more fake rows if desired
    ];
    
    return NextResponse.json({ type: 'sql-injection', data: fakeData });
  }

  // Basic XSS Simulation
  if (input.includes('<script>alert')) {
    console.log('Potential XSS Attempt:', attackerDetails);

    // Extract the alert message from the input
    const alertMessage = extractAlertMessage(input);

    // Log the attempt to MongoDB
    await logToDatabase(attackerDetails, 'xss');

    // Respond with the extracted alert message
    return NextResponse.json({ type: 'xss', alertMessage });
  }

  // Log normal input
  console.log('Normal User Input:', attackerDetails);

  // Optionally log normal user activity too
  await logToDatabase(attackerDetails, 'normal-input');

  // Respond normally
  return NextResponse.json({ type: 'normal', message: 'Input received' });
}
