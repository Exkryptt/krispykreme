import { getCustomSession } from '../../../../lib/sessionCode.js';
import connectToDatabase from '../../../../lib/mongodb';

export async function GET(req) {
    try {
        //logged in
        const session = await getCustomSession();
        if (!session?.email) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized: No session found' }),
                { status: 401 }
            );
        }

        const email = session.email;

        //mongodb
        const db = await connectToDatabase();
        const cartCollection = db.collection('carts');
        const cart = await cartCollection.findOne({ email });

        if (!cart) {
            return new Response(
                JSON.stringify({ items: [] }), //empty if not found
                { status: 200 }
            );
        }

        //cart items
        return new Response(
            JSON.stringify({ items: cart.cartItems }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500 }
        );
    }
}
