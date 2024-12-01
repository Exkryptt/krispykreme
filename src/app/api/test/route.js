        // TESTTTTTT


import connectToDatabase from '../../../../lib/mongodb';

export async function GET(req, res) {
    try {
        const db = await connectToDatabase();
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections);


        return new Response(JSON.stringify({
            message: 'Connected to MongoDB successfully!',
            collections
        }), { status: 200 });
    } catch (error) {
        console.error('Database connection error:', error);

        return new Response(JSON.stringify({ error: 'Failed to connect to the database' }), {
            status: 500,
        });
    }
}
