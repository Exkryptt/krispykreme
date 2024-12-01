import { getCustomSession } from '../../../../lib/sessionCode.js';
import connectToDatabase from '../../../../lib/mongodb';

export async function GET(req) {
    try {
        //logged in or not
        const session = await getCustomSession();
        if (!session?.email) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized: No session found' }),
                { status: 401 }
            );
        }

        const email = session.email;

        //MongoDB and clear cart
        const db = await connectToDatabase();
        const cartCollection = db.collection('carts');

        //remove
        const result = await cartCollection.updateOne(
            { email },
            { $set: { cartItems: [] } } //clear items array
        );

        if (result.modifiedCount === 0) {
            return new Response(
                JSON.stringify({ error: 'Failed to clear cart or cart not found' }),
                { status: 500 }
            );
        }

        //success message etc
        return new Response(
            JSON.stringify({ message: 'Cart cleared successfully' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in GET request:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500 }
        );
    }
}
