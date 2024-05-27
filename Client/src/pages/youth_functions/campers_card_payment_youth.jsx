import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const CampersCardPaymentYouth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { camp_id, camp_name, group_name, finalPrice, user_id, group_id, paymentId,registration_id } = location.state;
    console.log('payment id:',paymentId);
    const [cardDetails, setCardDetails] = useState({
        card_number: '',
        expiry_date: '',
        cvv: '',
        cardholder_name: ''
    });

    const [errors, setErrors] = useState({});

    const handleCardDetailsChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prevState => ({ ...prevState, [name]: value }));
    };

    const validateCardDetails = () => {
        const { card_number, expiry_date, cvv, cardholder_name } = cardDetails;
        const newErrors = {};

        // Validate card number having 16 digits
        if (!/^\d{16}$/.test(card_number)) {
            newErrors.card_number = 'Invalid card number';
        }

        // Validate expiry date (MM/YY format and not expired)
        const [month, year] = expiry_date.split('/').map(Number);
        if (!month || !year || month < 1 || month > 12 || year < new Date().getFullYear() % 100) {
            newErrors.expiry_date = 'Invalid expiry date';
        }

        // Validate CVV (3 or 4 digits)
        if (!/^\d{3,4}$/.test(cvv)) {
            newErrors.cvv = 'Invalid CVV';
        }

        // Validate cardholder name (not empty)
        if (!cardholder_name) {
            newErrors.cardholder_name = 'Cardholder name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleCardPayment = () => {
        if (!validateCardDetails()) {
            return;
        }

        const paymentData = {
            group_id: group_id,
            user_id: user_id,
            payment_id: paymentId,
            registration_id: registration_id,
            card_number: cardDetails.card_number,
            expiry_date: cardDetails.expiry_date,
            cvv: cardDetails.cvv,
            cardholder_name: cardDetails.cardholder_name
        };

        axios.post('http://localhost:3000/campers/card_payment', paymentData)
            .then(response => {
                alert('Payment successfully processed');
                navigate(`/adult_leader_functions/campers_success_pay/${user_id}`, { state: { user_id, group_name, camp_name } });
            })
            .catch(error => {
                console.error('Error storing card details:', error);
                alert('Failed to store card details');
            });
    };

    return (
        <div className="main-content">
            <h1>Enter Card Details for Payment</h1>
            <h2>Payment for {camp_name}</h2>
            <h3>Amount: ${finalPrice}</h3>
            <div className="payment-details">
                <input
                    type="text"
                    name="card_number"
                    placeholder="Card Number"
                    value={cardDetails.card_number}
                    onChange={handleCardDetailsChange}
                    className="form-input rounded-md shadow-sm mt-1 block w-full"
                />
                {errors.card_number && <p className="text-red-500">{errors.card_number}</p>}
                <input
                    type="text"
                    name="expiry_date"
                    placeholder="Expiry Date (MM/YY)"
                    value={cardDetails.expiry_date}
                    onChange={handleCardDetailsChange}
                    className="form-input rounded-md shadow-sm mt-1 block w-full"
                />
                {errors.expiry_date && <p className="text-red-500">{errors.expiry_date}</p>}
                <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                    className="form-input rounded-md shadow-sm mt-1 block w-full"
                />
                {errors.cvv && <p className="text-red-500">{errors.cvv}</p>}
                <input
                    type="text"
                    name="cardholder_name"
                    placeholder="Cardholder Name"
                    value={cardDetails.cardholder_name}
                    onChange={handleCardDetailsChange}
                    className="form-input rounded-md shadow-sm mt-1 block w-full"
                />
                {errors.cardholder_name && <p className="text-red-500">{errors.cardholder_name}</p>}
            </div>
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                onClick={handleCardPayment}
            >
                Submit Payment
            </button>
            <button
                    className="mt-2 px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600 focus:outline-none"
                    onClick={() =>  navigate(`/youth_camper_dashboard/${user_id}`)}// Go back to the previous page
                >
                    Back
                </button>
        </div>
    );
};

export default CampersCardPaymentYouth;
