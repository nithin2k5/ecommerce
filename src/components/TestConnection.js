import React, { useState, useEffect } from 'react';

const TestConnection = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Test the basic endpoint
        fetch('http://localhost:8080/api/test/hello')
            .then(response => response.json())
            .then(data => {
                setMessage(data.message);
            })
            .catch(err => {
                setError('Failed to connect to backend: ' + err.message);
            });
    }, []);

    const testLogin = () => {
        fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'businessadmin',
                password: 'admin123'
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Login response:', data);
            setMessage('Login successful: ' + JSON.stringify(data));
        })
        .catch(err => {
            setError('Login failed: ' + err.message);
        });
    };

    return (
        <div>
            <h2>Backend Connection Test</h2>
            {message && <p style={{color: 'green'}}>{message}</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
            <button onClick={testLogin}>Test Login</button>
        </div>
    );
};

export default TestConnection; 