'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Box, Typography, Card, CardContent, CardActions } from '@mui/material';

export default function CustomerPage() {
    const [products, setProducts] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const router = useRouter();

    // Fetch products from the database
    useEffect(() => {
        fetch('/api/getProducts')
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error('Error fetching products:', err));

        // Fetch cart count from the session
        fetch('/api/getCartItems')
            .then((res) => res.json())
            .then((data) => {
                // Ensure cart is initialized and updated properly
                if (data.cart) {
                    setCartCount(data.cart.length);
                } else {
                    setCartCount(0);
                }
            })
            .catch((err) => console.error('Error fetching cart:', err));
    }, []);

    const handleAddToCart = async (productId, quantity) => {
        try {
            const response = await fetch(`/api/putInCart?productId=${productId}&quantity=${quantity}`, {
                method: 'GET', // Or 'POST' if needed
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'  // Ensure session cookies are sent
            });
    
            if (!response.ok) {
                const errorData = await response.json(); // Attempt to parse error response
                console.error('Error adding to cart:', errorData.error || 'Unknown error');
                return;
            }
    
            const data = await response.json(); // Successfully parsed response
            console.log('Product added to cart:', data);
    
            // Handle the cart update (e.g., update UI)
    
        } catch (err) {
            console.error('Error adding to cart:', err);
        }
    };
    
    
    
    

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to Krispy Kreme!
            </Typography>
            <Typography variant="h6" gutterBottom>
                Products
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {products.length > 0 ? (
                    products.map((product) => (
                        <Card key={product._id} sx={{ width: 240, marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{product.pname}</Typography>
                                <Typography variant="body2">${product.price}</Typography>
                                <Typography variant="body2">{product.description}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAddToCart(product._id, 1)}
                                >
                                    Add to Cart
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                ) : (
                    <Typography>No products available.</Typography>
                )}
            </Box>

            <Box sx={{ marginTop: 4 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => router.push('/view_cart')}
                    sx={{ width: '100%' }}
                >
                    View Cart ({cartCount} items)
                </Button>
            </Box>
        </Box>
    );
}