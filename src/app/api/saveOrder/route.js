import { MongoClient } from 'mongodb';
import { getCustomSession } from '../../../../lib/sessionCode';

export async function POST(req) {
    const session = await getCustomSession();

    if (!session?.email) {
        return new Response(
            JSON.stringify({ error: 'Unauthorized' }),
            { status: 401 }
        );
    }

    const { products, totalAmount } = await req.json();

    if (!products || products.length === 0) {
        return new Response(
            JSON.stringify({ error: 'No products in the order' }),
            { status: 400 }
        );
    }

    try {
        //db
        const client = new MongoClient(process.env.DB_ADDRESS);
        await client.connect();
        const db = client.db('krispykreme');
        const ordersCollection = db.collection('orders');
        const cartCollection = db.collection('carts');

        //find user cart with email
        const cart = await cartCollection.findOne({ email: session.email });

        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            return new Response(
                JSON.stringify({ error: 'No items in cart to place an order' }),
                { status: 400 }
            );
        }

        //create order 
        const order = {
            email: session.email,
            products: cart.cartItems, //add items
            totalAmount: totalAmount,
            orderDate: new Date(),
            status: 'Pending',
        };

        //add to db
        const result = await ordersCollection.insertOne(order);

        //clear cart
        await cartCollection.updateOne(
            { email: session.email },
            { $set: { cartItems: [] } } // !!
        );

        // stop db
        await client.close();

        return new Response(
            JSON.stringify({ message: 'Order placed successfully', orderId: result.insertedId }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error saving order:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to save order' }),
            { status: 500 }
        );
    }
}
