import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function getCustomSession() {
    console.log('Initializing session');
    const cookieStore = await cookies(); // get the cookies

    console.log('Cookies:', cookieStore);  // store cookies to make sure they are sent properly

    const session = await getIronSession(cookieStore, {
        password: 'VIi8pH38vD8ZLgEZclSa7an3olx4pkh6pvBj9fGZf',
        cookieName: 'krispykreme-session',
        ttl: 60 * 60 * 24, // a day session expiration i think
    });

    console.log('Session Data:', session); // store session data to check its contents

    return session;
}
