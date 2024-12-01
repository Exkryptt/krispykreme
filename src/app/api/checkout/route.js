import { getCustomSession } from '../../../../lib/sessionCode.js';
import connectToDatabase from '../../../../lib/mongodb'; //MongoDB connection thing
import { ObjectId } from 'mongodb';

export async function POST(req) {
    try {
        const { cart } = await req.json();

        //make sure user logged in
        const session = await getCustomSession();
        const email = session?.email;

        if (!email || !cart || cart.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Invalid data or no items in cart' }),
                { status: 400 }
            );
        }

        //calc total
        const totalAmount = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

        //connect and insert into order collectsion 
        const db = await connectToDatabase();
        const ordersCollection = db.collection('orders');

        //create the order 
        const order = {
            email,
            items: cart,
            totalAmount,
            status: 'Pending',
            createdAt: new Date(),
        };

        //add  order into the database
        const result = await ordersCollection.insertOne(order);

        //clear cart???
        const cartCollection = db.collection('carts');
        await cartCollection.deleteOne({ email });

        //show order detil
        return new Response(
            JSON.stringify({
                message: 'Order placed successfully',
                orderId: result.insertedId,
                totalAmount,
                products: cart.map(item => ({
                    name: item.pname,
                    quantity: item.quantity,
                    totalPrice: item.quantity * item.price,
                })),
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during checkout:", error);
        return new Response(
            JSON.stringify({ error: "Failed to process the order" }),
            { status: 500 }
        );
    }
}
