'use client';

import { useState, useEffect } from 'react';

export default function ViewCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch cart items when the component mounts
    const fetchCartItems = async () => {
      try {
        const response = await fetch('/api/getCartItems', {
          method: 'GET',
          credentials: 'same-origin', // Ensure session cookies are sent
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
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.productId}>
              <p>{item.pname}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
