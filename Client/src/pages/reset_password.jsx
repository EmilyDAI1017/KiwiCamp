import React, { useState } from 'react';
import '../App.css';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/password_reset/request_reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        setMessage(data.message);
    };

    return (
        <div className="main-content mx-auto p-8 min-h-screen flex flex-col items-center"
        style={{
            backgroundImage: "url('/src/images/camp_bg2.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100vh'
          }}
        >
            <form onSubmit={handleSubmit}>
                <h2 className="text-4xl font-bold text-green-800 mb-8" >Reset Password</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className='border-2 border-green-700 rounded-lg p-2 m-2'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button className="mb-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold ml-3 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out" type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
