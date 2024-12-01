import connectToDatabase from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import { getCustomSession } from '../../../../lib/sessionCode.js';

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Find the user by email
        const user = await collection.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
        }

        // Check if the password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
        }

        // Get or initialize the session
        const session = await getCustomSession();

        // Set session data, including _id and role
        session.email = user.email;
        session.role = user.role;
        session._id = user._id.toString();  // Store the MongoDB _id in session
        await session.save();

        // Redirect based on the user's role
        if (user.role === 'manager') {
            return new Response(
                JSON.stringify({ message: 'Login successful!', role: user.role }),
                { status: 200 }
            );
        } else if (user.role === 'customer') {
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
