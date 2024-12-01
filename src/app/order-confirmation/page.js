'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function OrderConfirmationPage() {
    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4">Order Confirmation</Typography>
            <Typography>Your order has been placed successfully! Thank you for shopping with us.</Typography>
        </Box>
    );
}
