'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function OrderConfirmation() {
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch('/api/getCartItems', {
                    method: 'GET',
                    credentials: 'same-origin', //cookies
                });

                if (!response.ok) {
                    setMessage('Error fetching cart items');
                    return;
                }

                const cartData = await response.json();
                const cart = cartData.items || [];

                //save
                const orderData = {
                    products: cart.map(item => ({
                        productId: item.productId,
                        name: item.pname,
                        price: item.price,
                        quantity: item.quantity,
                        totalPrice: item.quantity * item.price,
                    })),
                    totalAmount: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
                };

                //send to save
                await fetch('/api/saveOrder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(orderData),
                });

                setMessage('Thank you for your order!'); //message
            } catch (error) {
                console.error('Error during order confirmation:', error);
                setMessage('Error during order confirmation');
            }
        };

        fetchCartItems();
    }, [router]);

    if (!message) {
        return <Typography variant="h6" align="center">Loading order...</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ backgroundColor: 'white', minHeight: '100vh', padding: '2rem' }}>
            {/* Display messages */}
            {message && (
                <Alert severity="info" sx={{ marginBottom: 2 }}>
                    {message}
                </Alert>
            )}

<Typography variant="h2" sx={{color: 'black !important', marginTop: 2 }}>
                Order Confirmed
            </Typography>

            <Typography variant="h6" sx={{color: 'black !important', marginTop: 2 }}>
                {message}
            </Typography>

            <Box sx={{ marginTop: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: '100%' }}
                    onClick={() => router.push('/customer')}
                >
                    Back to Shop
                </Button>
            </Box>
        </Container>
    );
}
