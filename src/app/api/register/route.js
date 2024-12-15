import connectToDatabase from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Check for required fields
        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({ error: 'Invalid email format' }), { status: 400 });
        }

        // Add character length validation
        if (email.length > 50) {
            return new Response(JSON.stringify({ error: 'Email too long (max 50 characters)' }), { status: 400 });
        }
        if (password.length > 100) {
            return new Response(JSON.stringify({ error: 'Password too long (max 100 characters)' }), { status: 400 });
        }

        // Connect to the database
        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Check if the user already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Register the user with a default role of 'customer'
        await collection.insertOne({
            email,
            password: hashedPassword,
            role: 'customer',
        });

        // Success response
        return new Response(JSON.stringify({ message: 'User registered successfully! Please log in.' }), { status: 201 });
    } catch (error) {
        console.error('Error during registration:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
