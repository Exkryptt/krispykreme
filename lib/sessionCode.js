import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function getCustomSession() {
    console.log('Initializing session');
    const cookieStore = await cookies(); // Fetch the cookies

    console.log('Cookies:', cookieStore);  // Log cookies to ensure they're sent properly

    const session = await getIronSession(cookieStore, {
        password: 'VIi8pH38vD8ZLgEZclSa7an3olx4pkh6pvBj9fGZf',
        cookieName: 'krispykreme-session',
        ttl: 60 * 60 * 24, // 1 day session expiration
    });

    console.log('Session Data:', session); // Log session data to check its contents

    return session;
}
