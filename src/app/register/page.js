'use client';

import { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); //new state for flag to track
    const router = useRouter();

    const handleRegister = async () => {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage('Registration successful! Redirecting to login...');
            setIsSuccess(true); //flag success
            setTimeout(() => {
                router.push('/login'); //short delay doesnt work
            }, 2000);
        } else {
            setMessage(`Error: ${data.error}`);
            setIsSuccess(false); //fail flag
        }
    };

    return (
        <Container maxWidth="sm" sx={{ padding: 3, backgroundColor: 'white', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom align="center">
                Register
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
                    onClick={handleRegister}
                    variant="contained"
                    color="primary"
                    sx={{ padding: '0.8rem' }}
                >
                    Register
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
