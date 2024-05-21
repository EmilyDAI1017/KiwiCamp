import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';

const ResetForm = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`/api/password_reset/reset/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });
        const data = await response.json();
        setMessage(data.message);
    };

    return (
        <div className="reset-form-container">
            <form onSubmit={handleSubmit}>
                <h2>Set New Password</h2>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetForm;
