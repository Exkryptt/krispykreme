import { getCustomSession } from '../../../../lib/sessionCode.js';

export async function DELETE(req) {
    const { productId } = await req.json();

    const session = await getCustomSession();
    if (!session.cart) {
        return new Response(JSON.stringify({ error: 'No items in cart' }), { status: 400 });
    }

    session.cart = session.cart.filter(item => item.productId !== productId);
    await session.save();

    return new Response(
        JSON.stringify({ message: 'Item removed from cart', cart: session.cart }),
        { status: 200 }
    );
}
