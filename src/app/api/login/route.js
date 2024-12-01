import connectToDatabase from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import { getCustomSession } from '../../../../lib/sessionCode.js';

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        const db = await connectToDatabase();
        const collection = db.collection('users');

        //email login logic
        const user = await collection.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
        }

        //check password true
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
        }

        //get session or start
        const session = await getCustomSession();

        // set session data including _id and role
        session.email = user.email;
        session.role = user.role;
        session._id = user._id.toString();  // store
        await session.save();

        //if manager go dashboard etc
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
