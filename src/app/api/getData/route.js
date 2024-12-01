import { getCustomSession } from '../../../../lib/sessionCode.js';

export async function GET(req, res) {
    const session = await getCustomSession();

    // getsession data
    const role = session.role;
    const email = session.email;

    console.log(`Role: ${role}, Email: ${email}`);
    return new Response(JSON.stringify({ role, email }), { status: 200 });
}
