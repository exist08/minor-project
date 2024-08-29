import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';

function SignUp() {
    const [enrollmentNumber, setEnrollmentNumber] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [classId, setClassId] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    const [{ data, loading, error }, signupCall] = useAxios(
        {
            url: 'http://localhost:3001/api/signup',
            method: 'post',
        },
        { manual: true }
    );

    const handleSignup = () => {
        signupCall({
            data: {
                enrollmentNumber,
                password,
                firstName,
                lastName,
                email,
                classId,
                dateOfBirth,
            },
        });
    };

    useEffect(() => {
        if (data && data.message) {
            alert('Signup successful');
        }
    }, [data]);

    return (
        <div>
            <h2>Student Signup</h2>
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
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Class ID"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
            />
            <input
                type="date"
                placeholder="Date of Birth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <button onClick={handleSignup} disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            {error && <p style={{ color: 'red' }}>Signup failed. Please try again.</p>}
        </div>
    );
}

export default SignUp;
