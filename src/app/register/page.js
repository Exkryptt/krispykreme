'use client';
import { useState } from 'react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage('Registration successful!');
        } else {
            setMessage(`Error: ${data.error}`);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Register</h1>
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
                onClick={handleRegister}
                style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                Register
            </button>
            <p>{message}</p>
        </div>
    );
}
