import { getCustomSession } from '../../../../lib/sessionCode.js';
import connectToDatabase from '../../../../lib/mongodb';

export async function GET(req) {
    try {
        // Fetch session to ensure the user is logged in
        const session = await getCustomSession();
        if (!session?.email) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized: No session found' }),
                { status: 401 }
            );
        }

        const email = session.email;

        // Connect to MongoDB and retrieve the user's cart
        const db = await connectToDatabase();
        const cartCollection = db.collection('carts');
        const cart = await cartCollection.findOne({ email });

        if (!cart) {
            return new Response(
                JSON.stringify({ items: [] }), // Return empty cart if none found
                { status: 200 }
            );
        }

        // Return the cart items
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
