import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        //get session cokies
        const cookieStore = await cookies();
        const session = await getIronSession(cookieStore, {
            password: 'VIi8pH38vD8ZLgEZclSa7an3olx4pkh6pvBj9fGZf',
            cookieName: 'krispykreme-session',
            ttl: 60 * 60 * 24, // a day i think again
        });

        // destroy the session
        session.destroy();

        // message
        return new Response(JSON.stringify({ message: 'Logged out successfully' }), { status: 200 });
    } catch (err) {
        console.error('Error during logout:', err);
        return new Response(
            JSON.stringify({ error: 'Logout failed' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
