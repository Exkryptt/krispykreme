'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, AppBar, Toolbar, IconButton, Container, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu'; // menu icon

export default function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0); // total cart price
    const [loading, setLoading] = useState(true); // loading state for the page
    const [error, setError] = useState(''); // error message
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        //get cart items
        const fetchCartItems = async () => {
            try {
                const response = await fetch('/api/getCartItems', {
                    method: 'GET',
                    credentials: 'same-origin', // send session cookiess
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.error || 'failed to fetch cart items'); //error
                    return;
                }

                const data = await response.json();
                setCart(data.items || []); // update cart with fetched items
                const totalAmount = data.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
                setTotal(totalAmount); // calctotal price
            } catch (err) {
                setError('error fetching cart items'); // handle get error
                console.error('error fetching cart items:', err);
            } finally {
                setLoading(false); // stop loading
            }
        };

        fetchCartItems();
    }, []);

    //handle checkout process
    const handleCheckout = async () => {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ cart }) //send cart data
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                setMessage(`checkout failed: ${errorData.error}`); // set error message
                return;
            }
    
            const data = await response.json();
            setMessage('order placed successfully'); // success message
            console.log('order placed successfully:', data);
            // redirect to order confirmation page
            setTimeout(() => router.push('/order-confirmation'), 1000);
        } catch (err) {
            setMessage('error during checkout'); // handle checkout error
            console.error('error during checkout:', err);
        }
    };

    // handle logout
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'same-origin', // sends session cookies
            });

            if (!response.ok) {
                setMessage('logout failed'); // error message
            } else {
                setMessage('logout successful'); // success message
                // redirect to login page
                setTimeout(() => router.push('/login'), 1000);
            }
        } catch (err) {
            setMessage('error logging out'); // handle logout error
            console.error('error logging out:', err);
        }
    };

    if (loading) {
        return <Typography variant="h6" align="center">loading cart...</Typography>; // loading state
    }

    if (error) {
        return <Typography variant="h6" align="center">{error}</Typography>; // error message
    }

    return (
        <Container maxWidth="lg" sx={{ backgroundColor: 'white', minHeight: '100vh', padding: '2rem' }}>
            {/* navbar */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        krispy kreme
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>logout</Button>
                    <Button color="inherit" onClick={() => router.push('/customer')}>shop</Button>
                </Toolbar>
            </AppBar>

            {/* display message */}
            {message && (
                <Alert severity="info" sx={{ marginTop: 2 }}>
                    {message}
                </Alert>
            )}

            <Typography variant="h4" gutterBottom sx={{ color: 'black' }}>
                checkout
            </Typography>

            {/* display cart items */}
            {cart.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {cart.map((item) => (
                        <Card key={item.productId} sx={{ marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{item.pname}</Typography>
                                <Typography variant="body2">quantity: {item.quantity}</Typography>
                                <Typography variant="body2">price: ${item.price}</Typography>
                                <Typography variant="body2">total: ${item.quantity * item.price}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                    <Typography variant="h6" sx={{ color: 'black', marginTop: 2 }}>
                        total: ${total} {/* total price */}
                    </Typography>
                </Box>
            ) : (
                <Typography>no items in cart</Typography> // empty cart message
            )}

            {/* checkout button */}
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 3 }}
                onClick={handleCheckout}
                disabled={cart.length === 0} // disable button if cart is empty
            >
                complete checkout
            </Button>
        </Container>
    );
}
