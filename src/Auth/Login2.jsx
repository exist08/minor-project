import './login2.css'
import sgslogo from '../assets/3_sgsits_logo.png'
import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import { Link, useNavigate } from 'react-router-dom';
import useToast from '../Utils/UseToast';

const Login2 = ({ setIsAuthenticated, user , setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { addToast, ToastContainer } = useToast();
    const navigate = useNavigate()
    const [{ data, loading, error }, loginCall] = useAxios(
        {
            url: 'http://localhost:5000/login',
            method: 'post',
        },
        { manual: true }
    );

    const handleLogin = () => {
        loginCall({
            data: {
                username: username,
                password: password,
            },
        });
    };

    useEffect(() => {
        if (data) {
            if (data.role === 'teacher') {
                // Handle teacher-specific logic
                localStorage.setItem('role', 'teacher')
                setUser(data);
            } else if (data.role === 'student') {
                // Handle student-specific logic
                localStorage.setItem('role', 'student')
                setUser(data);
            }else if (data.role === 'admin') {
                // Handle student-specific logic
                localStorage.setItem('role', 'admin')
                setUser(data);
            }
            localStorage.setItem('authToken', "tZiB1Iph7AIM4R6CxKyBvGzTVZXwsbUroGHOaLW44j3duYZaW4suqThIyvjDJTPp")
            localStorage.setItem('userId',data?._id)
            localStorage.setItem('classId',data?.classId)
            localStorage.setItem('user',JSON.stringify(data))
            setIsAuthenticated(true); // Set the authenticated state to true when the login is successful
            navigate('/')
            // You can redirect the user or store the session here
        } else if (error) {
            console.log(error)
            addToast("Invalid Username or password",'error');
        }
    }, [data || error]);

    return (
        <div className="login-container">
            <div className="screen-1">
                <div className="sgs-logo">
                    <img src={sgslogo} alt="" />
                </div>
                <h2>Login</h2>
                <div className="email">
                    <label htmlFor="email">Username</label>
                    <div className="sec-2"><input
                        type="text"
                        placeholder="Username here"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
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
                {/* <div className="footer">
                    <p><span>Don't have an account? | </span><Link to={'/signup'} style={{ display: 'inline' }}>Sign Up</Link>   </p>
                </div> */}
            </div>
            
            <ToastContainer />
        </div>
    )
}

export default Login2