const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const connection = require('../dbCOnnection');

const saltRounds = 10;

// Generate a random token
const generateToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Endpoint to handle password reset request
router.post('/request_reset', (req, res) => {
    const { email } = req.body;
    const token = generateToken();

    // Check if the email exists in the database
    const query = 'SELECT user_id FROM users WHERE email = ?';
    connection.query(query, [email], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        const user = result[0];
        const updateQuery = 'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?';
        const expires = Date.now() + 3600000; // 1 hour

        connection.query(updateQuery, [token, expires, email], (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // Send reset email
            const mailOptions = {
                to: email,
                from: process.env.EMAIL,
                subject: 'Password Reset For Kiwi Camp ',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account at Kiwi Camp.\n\n` +
                    `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                    `http://localhost:5173/reset/${token}\n\n` +
                    `If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.error('Error sending email:', err);
                    return res.status(500).json({ message: 'Error sending email' });
                }

                res.status(200).json({ message: 'Reset link sent' });
            });
        });
    });
});

// Endpoint to reset the password
router.post('/reset/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const query = 'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?';
    connection.query(query, [token, Date.now()], async (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        const user = result[0];
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const updateQuery = 'UPDATE users SET password_hash = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE user_id = ?';

        connection.query(updateQuery, [hashedPassword, user.user_id], (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(200).json({ message: 'Password has been reset' });
        });
    });
});

module.exports = router;
