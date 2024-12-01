import connectToDatabase from '../../../../lib/mongodb';

export async function GET(req, res) {
    try {
        const db = await connectToDatabase();

        // Example query: Fetch all collections in the database
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections); // Log collections for debugging

        // Send a JSON response back
        return new Response(JSON.stringify({
            message: 'Connected to MongoDB successfully!',
            collections
        }), { status: 200 });
    } catch (error) {
        console.error('Database connection error:', error);

        // Send an error response
        return new Response(JSON.stringify({ error: 'Failed to connect to the database' }), {
            status: 500,
        });
    }
}
