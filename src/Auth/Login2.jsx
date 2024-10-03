import './login2.css'
import sgslogo from '../assets/3_sgsits_logo.png'
import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import { Link, useNavigate } from 'react-router-dom';

const Login2 = ({ setIsAuthenticated }) => {
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
        //         username,
        //         password,
        //     },
        // });
        setIsAuthenticated(true); // Set the authenticated state to true when the login is successful
        navigate('/')
    };

    useEffect(() => {
        if (data) {
            alert('Login successful');
            if (data.role === 'teacher') {
                // Handle teacher-specific logic
                setUser(data);
            } else if (data.role === 'student') {
                // Handle student-specific logic
                setUser(data);
            }
            // You can redirect the user or store the session here
        } else if(error) {
            console.log(error)
        }
    }, [data]);

    return (
        <div className="login-container">
            <div className="screen-1">
                <div className="sgs-logo">
                    <img src={sgslogo} alt="" />
                </div>
                <h2>Student Login</h2>
                <div className="email">
                    <label htmlFor="email">EnrollMent Number</label>
                    <div className="sec-2"><input
                        type="text"
                        placeholder="Ex: 0801CA231XXX"
                        value={enrollmentNumber}
                        required
                        onChange={(e) => setEnrollmentNumber(e.target.value)}
                    />
                    </div>
                </div>
                <div className="password">
                    <label htmlFor="password">Password</label>
                    <div className="sec-2">
                        <input
                            type="password"
                            placeholder="Enter password here..."
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <button onClick={handleLogin} disabled={loading} className="login">{loading ? 'Logging in...' : 'Login'} </button>
                <div className="footer">
                    <p><span>Don't have an account? | </span><Link to={'/signup'} style={{ display: 'inline' }}>Sign Up</Link>   </p>
                </div>
            </div>
        </div>
    )
}

export default Login2