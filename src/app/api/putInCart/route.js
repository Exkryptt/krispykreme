import { getCustomSession } from '../../../../lib/sessionCode.js';
import connectToDatabase from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req) {
    try {
        // Parse the productId and quantity from query parameters
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const productId = urlParams.get('productId');
        const quantity = urlParams.get('quantity');

        // Ensure productId and quantity are provided
        if (!productId || !quantity) {
            return new Response(
                JSON.stringify({ error: 'ProductId and quantity are required' }),
                { status: 400 }
            );
        }

        // Fetch session to ensure user is logged in
        const session = await getCustomSession();
        if (!session?.email) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized: No session found' }),
                { status: 401 }
            );
        }

        const email = session.email;

        // Connect to MongoDB and get the product
        const db = await connectToDatabase();
        const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return new Response(
                JSON.stringify({ error: 'Product not found' }),
                { status: 404 }
            );
        }

        // Access the user's cart
        const cartCollection = db.collection('carts');
        let cart = await cartCollection.findOne({ email });

        if (!cart) {
            // If no cart exists, initialize an empty cart
            cart = { email, cartItems: [] };
        }

        // Check if product already exists in the cart
        const existingProduct = cart.cartItems.find(item => item.productId === productId);

        if (existingProduct) {
            // Update the quantity if the product is already in the cart
            existingProduct.quantity += parseInt(quantity);
        } else {
            // Add the product to the cart if it doesn't exist
            cart.cartItems.push({
                productId,
                quantity: parseInt(quantity),
                pname: product.pname,
                price: product.price,
            });
        }

        // Save the cart back to MongoDB
        await cartCollection.updateOne(
            { email },
            { $set: { cartItems: cart.cartItems } },
            { upsert: true }
        );

        // Return the updated cart
        return new Response(
            JSON.stringify({ message: 'Product added to cart', cartItems: cart.cartItems }),
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
