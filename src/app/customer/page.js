'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Box, Typography, Card, CardContent, CardActions, AppBar, Toolbar, IconButton, Container, Alert } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; 

export default function CustomerPage() {
    const [products, setProducts] = useState([]); 
    const [message, setMessage] = useState(''); 
    const [weather, setWeather] = useState(null); // weather data state
    const router = useRouter();

    // get products from the database
    useEffect(() => {
        fetch('/api/getProducts')
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => {
                setMessage('Error fetching products.');
                console.error('Error fetching products:', err);
            });

        // get weather data from my API
        fetch('/api/getWeather')
            .then((res) => res.json())
            .then((data) => setWeather(data.temp))  // change weather state with the current temperature
            .catch((err) => {
                setMessage('Error fetching weather data.');
                console.error('Error fetching weather data:', err);
            });
    }, []);

    // logout function
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'same-origin', // make sure session cookies are sent
            });

            if (!response.ok) {
                setMessage('Logout failed');
            } else {
                setMessage('Logout successful');
                setTimeout(() => router.push('/login'), 1000);
            }
        } catch (err) {
            setMessage('Error logging out.');
            console.error('Error logging out:', err);
        }
    };

    const handleAddToCart = async (productId, quantity) => {
        try {
            const response = await fetch(`/api/putInCart?productId=${productId}&quantity=${quantity}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                const errorData = await response.json(); 
                setMessage(errorData.error || 'Unknown error');
                return;
            }

            const data = await response.json(); 
            setMessage('Product added to cart');
        } catch (err) {
            setMessage('Error adding to cart');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ backgroundColor: 'white', minHeight: '100vh', padding: '2rem' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Krispy Kreme
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    <Button color="inherit" onClick={() => router.push('/view_cart')}>View Cart</Button>
                    <Button color="inherit" onClick={() => router.push('/register')}>Register</Button>
                </Toolbar>
            </AppBar>

            {message && (
                <Alert severity="info" sx={{ marginTop: 2 }}>
                    {message}
                </Alert>
            )}

            <Typography variant="h4" gutterBottom sx={{ color: 'black !important' }}>
                Welcome to Krispy Kreme!
            </Typography>

            {/* Display current temperature */}
            {weather !== null ? (
                <Typography variant="h6" sx={{color:"black!important", marginTop: 2 }}>
                    Today's temperature: {weather}°C
                </Typography>
            ) : (
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                    Weather information is not available.
                </Typography>
            )}

            <Typography variant="h5" gutterBottom sx={{ color: 'black !important' }}>
                Elihs Special Menu
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
        </Container>
    );
}
