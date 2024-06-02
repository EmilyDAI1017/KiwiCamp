import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { group, camp, camp_id, user_id, group_id } = location.state;
    const [paymentMethod, setPaymentMethod] = useState('card');

    const handlePayment = () => {
        const paymentData = {
            user_id,
            camp_id: camp_id,
            amount: camp.price,
            request_date: new Date().toISOString().split('T')[0],
            description: `Payment for group ${group.group_name} at camp ${camp.location} from user ${user_id}`,
            payment_status: 'Unpaid',
            pay_type: paymentMethod === 'card' ? 'Card' : 'Bank'
        };

        axios.post(`http://localhost:3000/groups/payments`, paymentData)
            .then(response => {
                const paymentId = response.data.payment_id;

                if (paymentMethod === 'card') {
                    navigate('/card_payment', { state: { group, camp, user_id, group_id, paymentId } });
                } else if (paymentMethod === 'bank') {
                    axios.put(`http://localhost:3000/groups/bank_info/${paymentId}`, { pay_type: 'Bank' })
                        .then(() => {
                            navigate(`/bank_info/${user_id}`, { state: { user_id, group_name: group.group_name, camp_name: camp.camp_name, paymentId } });
                        })
                        .catch(error => {
                            console.error('Error updating payment record:', error);
                            alert('Failed to update payment record.');
                        });
                }
            })
            .catch(error => {
                console.error('Error creating payment record:', error);
                alert('Failed to create payment record.');
            });
    };

    return (
        <div className="main-content flex bg-cover bg-center bg-no-repeat p-8"
        style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')",
                height: '100vh'
        }}>
            <div className="container mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6">Payment for Group: {group.group_name}</h1>
                <div className="mb-6 text-2xl">
                    <p><strong>Camp:</strong> {camp.camp_name}</p>
                    <p><strong>Camp ID:</strong> {camp_id}</p>
                    <p><strong>Price:</strong> ${camp.price}</p>
                    <p><strong>Number of Attendees:</strong> {group.number_of_attendees}</p>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
                    <div className="items-center mb-4">
                        <label className="items-center">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                            />
                            <span className="ml-2">Pay by Card</span>
                        </label>
                        <label className="items-center ml-6">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="bank"
                                checked={paymentMethod === 'bank'}
                                onChange={() => setPaymentMethod('bank')}
                                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                            />
                            <span className="ml-2">Bank Transfer</span>
                        </label>
                    </div>
                </div>
                <div className=" space-x-4">
                    <button
            className="mb-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold ml-3 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
            onClick={handlePayment}
                    >
                        Proceed with Payment
                    </button>
                    <button
            className="mb-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold ml-3 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
            onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
