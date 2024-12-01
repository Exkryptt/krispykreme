import connectToDatabase from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');

        //check if user exist
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 });
        }

        //Hash 
        const hashedPassword = await bcrypt.hash(password, 10);

        // make registered user be customer by default
        await collection.insertOne({
            email,
            password: hashedPassword,
            role: 'customer',
        });

        //success
        return new Response(JSON.stringify({ message: 'User registered successfully! Please log in.' }), { status: 201 });
    } catch (error) {
        console.error('Error during registration:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
