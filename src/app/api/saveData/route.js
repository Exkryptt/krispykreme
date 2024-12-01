import { getCustomSession } from '../../../../lib/sessionCode.js';

export async function GET(req, res) {
    const session = await getCustomSession();

    // Set session data
    session.role = 'customer'; // Example role
    session.email = 'customer@example.com'; // Example email
    await session.save();

    console.log("Session data saved");
    return new Response(JSON.stringify({ success: true }), { status: 200 });
}
