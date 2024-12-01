'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper, Button, AppBar, Toolbar, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu'; 

export default function ManagerDashboard() {
    const [orders, setOrders] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/getOrders');
                const data = await response.json();
                setOrders(data.orders || []); 
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    // calc logic
    const totalOrders = orders.length;
    const totalOrderValue = orders.reduce((acc, order) => acc + order.totalAmount, 0).toFixed(2);

    //logout function
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'same-origin', //cookies
            });

            if (!response.ok) {
                console.error('Logout failed');
            } else {
                //go to login after logout
                router.push('/login');
            }
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            {/* Navbar */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Krispy Kreme
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>

            <Typography variant="h4" gutterBottom>
                Manager Dashboard
            </Typography>

            {/* Total Orders and Total Order Value */}
            <Paper sx={{ padding: 2, marginBottom: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Total Orders: {totalOrders}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Total Order Value: ${totalOrderValue}
                </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom>
                Orders
            </Typography>
            
            {orders.length === 0 ? (
                <Paper sx={{ padding: 2 }}>
                    <Typography>No orders yet.</Typography>
                </Paper>
            ) : (
                <List>
                    {orders.map((order, index) => (
                        <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
                            <Typography variant="h6">Order ID: {order._id}</Typography>
                            <Typography variant="body1">Total: ${order.totalAmount}</Typography>
                            <Typography variant="body1">Status: {order.status}</Typography>

                            {/* Check if products exists and is an array */}
                            {Array.isArray(order.products) && order.products.length > 0 ? (
                                <List sx={{ paddingLeft: 2 }}>
                                    {order.products.map((product, idx) => (
                                        <ListItem key={idx} sx={{ paddingLeft: 0 }}>
                                            <ListItemText
                                                primary={`${product.name} x${product.quantity}`}
                                                secondary={`Total Price: $${product.totalPrice}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography>No products in this order.</Typography>
                            )}
                            <Divider sx={{ marginTop: 2 }} />
                        </Paper>
                    ))}
                </List>
            )}
        </Box>
    );
}
