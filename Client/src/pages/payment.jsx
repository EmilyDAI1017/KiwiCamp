import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { group, camp, camp_name, price, user_id, group_id } = location.state;
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [showBankInfo, setShowBankInfo] = useState(false);

    const handlePayment = () => {
        const paymentData = {
            user_id,
            camp_id: camp.camp_id,
            amount: price,
            request_date: new Date().toISOString().split('T')[0],
            description: `Payment for group ${group.group_name} at camp ${camp.location} from user ${user_id}`,
            payment_status: 'Unpaid'
        };

        // Create payment record in the database
        axios.post(`http://localhost:3000/groups/payments`, paymentData)
            .then(response => {
                const paymentId = response.data.payment_id;

                if (paymentMethod === 'card') {
                    navigate('/card_payment', { state: { group, camp, user_id, group_id, paymentId } });
                } else if (paymentMethod === 'bank') {
                    setShowBankInfo(true);
                }
            })
            .catch(error => {
                console.error('Error creating payment record:', error);
                alert('Failed to create payment record.');
            });
    };

    return (
        <div className="main-content">
            <h1>Payment for Group: {group.group_name}</h1>
            <div className="payment-details">
                <p><strong>Camp:</strong> {camp.camp_name}</p>
                <p><strong>Price:</strong> ${price}</p>
                <p><strong>Number of Attendees:</strong> {group.number_of_attendees}</p>
            </div>
            <div className="payment-method">
                <h2>Select Payment Method</h2>
                <label>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => {
                            setPaymentMethod('card');
                            setShowBankInfo(false);
                        }}
                        className="mr-2"
                    />
                    Pay by Card
                </label>
                <label className="ml-4">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={() => {
                            setPaymentMethod('bank');
                            setShowBankInfo(false);
                        }}
                        className="mr-2"
                    />
                    Bank Transfer
                </label>
            </div>
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                onClick={handlePayment}
            >
                Proceed with Payment
            </button>
            {showBankInfo && (
                <div className="bank-info mt-4">
                    <h3>Bank Transfer Information</h3>
                    <p><strong>Account Name:</strong> Kiwi Camp</p>
                    <p><strong>Account Number:</strong> 1000-1000-1000-1000</p>
                    <p><strong>Reference:</strong> {`${group.group_name}-${camp.camp_name}`}</p>
                    <p>Please email the proof of payment to kiwi_camp@gmail.com. Your group application will be processed once the payment is confirmed.</p>
                </div>
            )}
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                onClick={() => navigate(-1)} // Go back to the previous page
            >
                Back
            </button>
        </div>
    );
};

export default Payment;
