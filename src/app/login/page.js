'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
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
            // Redirect based on the user's role
            if (data.role === 'customer') {
                router.push('/customer'); // Redirect customer to the customer page
            } else if (data.role === 'manager') {
                router.push('/manager-dashboard'); // Redirect manager to the dashboard
            }
        } else {
            setMessage(`Error: ${data.error}`);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Login</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: 'block', marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: 'block', marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
            />
            <button
                onClick={handleLogin}
                style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                Login
            </button>
            <p>{message}</p>
        </div>
    );
}
