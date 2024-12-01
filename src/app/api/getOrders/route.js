import { MongoClient } from 'mongodb';
import { getCustomSession } from '../../../../lib/sessionCode';

export async function GET(req) {
    try {
        const session = await getCustomSession();

        //make sure its manager role
        if (!session?.email || session.role !== 'manager') {
            return new Response(
                JSON.stringify({ error: 'Unauthorized: Manager access required' }),
                { status: 401 }
            );
        }

        //db connect
        const client = new MongoClient(process.env.DB_ADDRESS);
        await client.connect();
        const db = client.db('app');
        const ordersCollection = db.collection('orders');

        //get all orders
        const orders = await ordersCollection.find({}).toArray();

        //stop db
        await client.close();

        //map logic
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            email: order.email,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt,
            products: order.items.map(item => ({
                name: item.pname,
                quantity: item.quantity,
                totalPrice: item.quantity * item.price
            }))
        }));

        //formatted orderes
        return new Response(
            JSON.stringify({ orders: formattedOrders }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching orders:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch orders' }),
            { status: 500 }
        );
    }
}
