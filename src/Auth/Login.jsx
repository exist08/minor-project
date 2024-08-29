import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
    const [enrollmentNumber, setEnrollmentNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const [{ data, loading, error }, loginCall] = useAxios(
        {
            url: 'http://localhost:3001/api/login',
            method: 'post',
        },
        { manual: true }
    );

    const handleLogin = () => {
        // loginCall({
        //     data: {
        //         enrollmentNumber,
        //         password,
        //     },
        // });
        setIsAuthenticated(true); // Set the authenticated state to true when the login is successful
        navigate('/')
    };

    useEffect(() => {
        if (data && data.message) {
            alert('Login successful');
            // You can redirect the user or store the session here
        }
    }, [data]);

    return (
        <div>
            <h2>Student Login</h2>
            <input
                type="text"
                placeholder="Enrollment Number"
                value={enrollmentNumber}
                onChange={(e) => setEnrollmentNumber(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p style={{ color: 'red' }}>Login failed. Please try again.</p>}
        </div>
    );
}

export default Login;
