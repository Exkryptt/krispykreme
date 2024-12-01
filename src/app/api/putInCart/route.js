import { getCustomSession } from '../../../../lib/sessionCode.js';
import connectToDatabase from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req) {
    try {
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const productId = urlParams.get('productId');
        const quantity = urlParams.get('quantity');

        // make sure id and quantity provided
        if (!productId || !quantity) {
            return new Response(
                JSON.stringify({ error: 'ProductId and quantity are required' }),
                { status: 400 }
            );
        }

        //get session for validation
        const session = await getCustomSession();
        if (!session?.email) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized: No session found' }),
                { status: 401 }
            );
        }

        const email = session.email;

        //db and prodict get
        const db = await connectToDatabase();
        const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return new Response(
                JSON.stringify({ error: 'Product not found' }),
                { status: 404 }
            );
        }

        //get the users sepcific cart
        const cartCollection = db.collection('carts');
        let cart = await cartCollection.findOne({ email });

        if (!cart) {
            //make empty cart if not found
            cart = { email, cartItems: [] };
        }

        //if already exist 
        const existingProduct = cart.cartItems.find(item => item.productId === productId);

        if (existingProduct) {
            //update quanity if alrdy in cart
            existingProduct.quantity += parseInt(quantity);
        } else {
            //add if not in
            cart.cartItems.push({
                productId,
                quantity: parseInt(quantity),
                pname: product.pname,
                price: product.price,
            });
        }

        //save cart to db
        await cartCollection.updateOne(
            { email },
            { $set: { cartItems: cart.cartItems } },
            { upsert: true }
        );

        //return update cart
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
