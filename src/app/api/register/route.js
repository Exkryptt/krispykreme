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

        // Check if the user already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user with the 'customer' role
        await collection.insertOne({
            email,
            password: hashedPassword,
            role: 'customer',
        });

        return new Response(JSON.stringify({ message: 'User registered successfully!' }), { status: 201 });
    } catch (error) {
        console.error('Error during registration:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
