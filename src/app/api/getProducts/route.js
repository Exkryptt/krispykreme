import connectToDatabase from '../../../../lib/mongodb';

export async function GET() {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('products');
        const products = await collection.find({}).toArray();

        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
