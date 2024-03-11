import React, { useState } from 'react';
import "../styles/AuthForm.css";


const AuthForm = ({ onClose, onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSelected, setIsSelected] = useState('login');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!isLogin) {
            try {
                const response = await fetch('http://localhost:3001/users/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "username": userName,
                        "password": password,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();

                    throw new Error(errorData.message || 'Failed to create user');
                }
                onAuthSuccess();
                const userData = await response.json();
                console.log('User created successfully:', userData);
            } catch (error) {
                console.error('Error creating user:', error.message);
            }
        }
        else {
            try {
                const response = await fetch('http://localhost:3001/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: userName,
                        password: password,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Login successful:', data);
                    onAuthSuccess(data);
                } else {
                    const errorData = await response.json();
                    console.error('Login failed:', errorData);
                }
            } catch (error) {
                setError(error.response?.data?.error || "An error occurred during login.");
            }
        }
    };

    return (
        <div>
            <div className="toggle-wrapper">
                <div
                    className={`toggle-option ${ isLogin ? 'selected' : ''}`}
                    onClick={() => setIsLogin(true)}
                >
                    Login
                </div>
                <div
                    className={`toggle-option ${ !isLogin ? 'selected' : ''}`}
                    onClick={() => setIsLogin(false)}
                >
                    Register
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                {!isLogin && (
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
                )}
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            {error && <p>{error}</p>}
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default AuthForm;
