import { getCustomSession } from '../../../../lib/sessionCode.js';

export async function GET(req, res) {
    const session = await getCustomSession();

    //set
    session.role = 'customer';
    session.email = 'customer@example.com';
    await session.save();

    console.log("Session data saved");
    return new Response(JSON.stringify({ success: true }), { status: 200 });
}
