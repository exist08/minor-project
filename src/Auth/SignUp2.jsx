import "./signup2.css"
import sgslogo from '../assets/3_sgsits_logo.png'
import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import { Link, useNavigate } from 'react-router-dom';

const SignUp2 = () => {
    return (
        <div className="screen-2">
            <div className="wrapper">
                <div className="sgs-logo">
                    <img src={sgslogo} alt="" />
                </div>
                <h2>Student Registration</h2>   
                <form action="#">
                    <div className="input-box">
                        <input type="text" placeholder="Enter your name" required="" />
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder="Enter your email" required="" />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Create password" required="" />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Confirm password" required="" />
                    </div>
                    <div className="input-box">
                        <button type="Submit" defaultValue="Register Now">Register Now</button>
                    </div>
                    <div className="text">
                        <h3>
                            <span>
                            Already have an account? 
                            </span>
                            <Link to="/login">Login</Link>
                        </h3>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp2