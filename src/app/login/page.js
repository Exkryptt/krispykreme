'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box, Typography, Container, Alert, CircularProgress } from '@mui/material';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const router = useRouter();

    const handleLogin = async () => {
        // Reset message and start loading
        setMessage('');
        setIsLoading(true);

        // Client-side validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !password) {
            setMessage('Email and password are required.');
            setIsSuccess(false);
            setIsLoading(false);
            return;
        }
        if (!emailRegex.test(email)) {
            setMessage('Invalid email format.');
            setIsSuccess(false);
            setIsLoading(false);
            return;
        }
        if (password.length < 6 || password.length > 100) {
            setMessage('Password must be between 6 and 100 characters.');
            setIsSuccess(false);
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('Login successful!');
                setIsSuccess(true);

                // Redirect based on role
                if (data.role === 'customer') {
                    router.push('/customer');
                } else if (data.role === 'manager') {
                    router.push('/manager-dashboard');
                }
            } else {
                setMessage(`Error: ${data.error}`);
                setIsSuccess(false);
            }
        } catch (error) {
            setMessage('An unexpected error occurred. Please try again.');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ padding: 3, backgroundColor: 'white', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom align="center">
                Login
            </Typography>

            <Box
                component="form"
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
            >
                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button
                    onClick={handleLogin}
                    variant="contained"
                    color="primary"
                    sx={{ padding: '0.8rem' }}
                    disabled={isLoading} // Disable during loading
                >
                    <Button
    onClick={() => router.push('/register')}
    variant="contained"
    color="secondary"
    sx={{ padding: '0.8rem' }}
>
    Register
</Button>

                    
                    {isLoading ? <CircularProgress size={24} /> : 'Login'}
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
