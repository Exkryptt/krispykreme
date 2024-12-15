import connectToDatabase from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import { getCustomSession } from '../../../../lib/sessionCode.js';

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Validate input
        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
        }
        if (email.length > 50) {
            return new Response(JSON.stringify({ error: 'Email too long (max 50 characters)' }), { status: 400 });
        }
        if (password.length < 6 || password.length > 100) {
            return new Response(JSON.stringify({ error: 'Password must be between 6 and 100 characters' }), { status: 400 });
        }

        // Email login logic
        const user = await collection.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
        }

        // Get session or start one
        const session = await getCustomSession();

        // Set session data
        session.email = user.email;
        session.role = user.role;
        session._id = user._id.toString(); // Store user ID
        await session.save();

        // Role-based response
        if (user.role === 'manager' || user.role === 'customer') {
            return new Response(
                JSON.stringify({ message: 'Login successful!', role: user.role }),
                { status: 200 }
            );
        } else {
            return new Response(
                JSON.stringify({ error: 'Invalid role' }),
                { status: 403 }
            );
        }
    } catch (error) {
        console.error('Error during login:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
