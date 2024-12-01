'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; //for nav
import { Button, AppBar, Toolbar, IconButton, Typography, Box, Container, Card, CardContent, CardActions, Alert } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function ViewCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter(); // nav

  useEffect(() => {
    // get cart
    const fetchCartItems = async () => {
      try {
        const response = await fetch('/api/getCartItems', {
          method: 'GET',
          credentials: 'same-origin', //cookies
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch cart items');
          return;
        }

        const data = await response.json();
        setCartItems(data.items || []);
      } catch (err) {
        setError('Error fetching cart items');
        console.error('Error fetching cart items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  if (loading) {
    return <Typography variant="h6" align="center">Loading cart...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center">{error}</Typography>;
  }

  const handleCheckout = () => {
    //go checkout
    router.push('/checkout');
  };

  //logout function
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin', //cookies
      });

      if (!response.ok) {
        setMessage('Logout failed');
      } else {
        setMessage('Logout successful');
        //go login 
        setTimeout(() => router.push('/login'), 1000);
      }
    } catch (err) {
      setMessage('Error logging out');
      console.error('Error logging out:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: 'white', minHeight: '100vh', padding: '2rem' }}>
      {/* Hardcoded Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Krispy Kreme
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
          <Button color="inherit" onClick={() => router.push('/customer')}>Shop</Button>
        </Toolbar>
      </AppBar>

      {/* Display messages */}
      {message && (
        <Alert severity="info" sx={{ marginTop: 2 }}>
          {message}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom sx={{ color: 'black!important' }}>
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="h6"sx={{ color: 'black!important' }}>Your cart is empty.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cartItems.map((item) => (
            <Card key={item.productId} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">{item.pname}</Typography>
                <Typography variant="body2">Quantity: {item.quantity}</Typography>
                <Typography variant="body2">Price: ${item.price}</Typography>
                <Typography variant="body2">Total: ${item.quantity * item.price}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {cartItems.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          sx={{ marginTop: 2 }}
        >
          Proceed to Checkout
        </Button>
      )}
    </Container>
  );
}
