'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); //new state
    const router = useRouter();

    const handleLogin = async () => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage('Login successful!');
            setIsSuccess(true); // Set success true
            // redirect based on role
            if (data.role === 'customer') {
                router.push('/customer'); //cusomer page
            } else if (data.role === 'manager') {
                router.push('/manager-dashboard'); // manager page
            }
        } else {
            setMessage(`Error: ${data.error}`);
            setIsSuccess(false); // success false
        }
    };

    return (
        <Container maxWidth="sm" sx={{ padding: 3, backgroundColor: 'white', minHeight: '400vh' }}>
            <Typography variant="h4" gutterBottom align="center">
                Login
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    onClick={handleLogin}
                    variant="contained"
                    color="primary"
                    sx={{ padding: '0.8rem' }}
                >
                    Login
                </Button>

                {message && (
                    <Alert severity={isSuccess ? 'success' : 'error'} sx={{ marginTop: 2 }}>
                        {message}
                    </Alert>
                )}
            </Box>
        </Container>
    );
}
