import './login2.css'
import sgslogo from '../assets/3_sgsits_logo.png'
import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import { Link, useNavigate } from 'react-router-dom';
import useToast from '../Utils/UseToast';

const Login2 = ({ setIsAuthenticated, user, setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast, ToastContainer } = useToast();
    const navigate = useNavigate()
    const [{ data, loading, error }, loginCall] = useAxios(
        {
            url: 'http://localhost:5000/login',
            method: 'post',
        },
        { manual: true }
    );


    const [{ loading: resetLoading }, resetPasswordCall] = useAxios(
        {
            url: 'http://localhost:5000/reset-password',
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

    const handleResetPassword = () => {
        resetPasswordCall({
            data: {
                username: username,
                currentPassword: currentPassword,
                newPassword: newPassword,
            },
        }).then(response => {
            addToast('Password reset successful', 'success');
            setIsModalOpen(false);
        }).catch(err => {
            addToast('Failed to reset password', 'error');
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
            } else if (data.role === 'admin') {
                // Handle student-specific logic
                localStorage.setItem('role', 'admin')
                setUser(data);
            }
            localStorage.setItem('authToken', "tZiB1Iph7AIM4R6CxKyBvGzTVZXwsbUroGHOaLW44j3duYZaW4suqThIyvjDJTPp")
            localStorage.setItem('userId', data?._id)
            localStorage.setItem('classId', data?.classId)
            localStorage.setItem('user', JSON.stringify(data))
            setIsAuthenticated(true); // Set the authenticated state to true when the login is successful
            navigate('/')
            // You can redirect the user or store the session here
        } else if (error) {
            console.log(error)
            addToast("Invalid Username or password", 'error');
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
                <button
                    className="btn btn-link mt-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    Reset Password?
                </button>
            </div>

            {/* Reset Password Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-xl">Reset Password</h3>

                        <div className="email">
                            <label htmlFor="email">Username</label>
                            <div className="sec-2"><input
                                type="text"
                                placeholder="Username here"
                                value={username}
                                className="input input-bordered text-black"
                                style={{ backgroundColor: 'rgb(209,213,219)' }}
                                required
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Current Password</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Current Password"
                                className="input input-bordered bg-gray-300 text-black"
                                style={{ backgroundColor: 'rgb(209,213,219)' }}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">New Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="input input-bordered bg-gray-500 text-black"
                                value={newPassword}
                                style={{ backgroundColor: 'rgb(209,213,219)' }}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="modal-action">
                            <button
                                className="btn btn-primary"
                                onClick={handleResetPassword}
                                disabled={resetLoading}
                            >
                                {resetLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                            <button className="btn" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    )
}

export default Login2