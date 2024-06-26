import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const CardPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { group, camp, user_id, group_id, paymentId} = location.state;

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
            card_number: cardDetails.card_number,
            expiry_date: cardDetails.expiry_date,
            cvv: cardDetails.cvv,
            cardholder_name: cardDetails.cardholder_name,
            payment_id: paymentId
        };

        axios.post('http://localhost:3000/groups/card_payment', paymentData)
            .then(response => {
                alert('Payment successfully processed');
                navigate(`/group_leader_functions/groups/group_success_pay/${user_id}`);
            })
            .catch(error => {
                console.error('Error storing card details:', error);
                alert('Failed to store card details');
            });
    };

    return (
        <div className="main-content min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-8" 
        style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')" }}>
       <div className="container mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md">
           <h1 className="text-3xl font-bold mb-6 text-center">Enter Card Details for Payment</h1>
           <div className="payment-details space-y-4">
               <div>
                   <input
                       type="text"
                       name="card_number"
                       placeholder="Card Number"
                       value={cardDetails.card_number}
                       onChange={handleCardDetailsChange}
                       className="form-input rounded-md shadow-sm mt-1 block w-full"
                   />
                   {errors.card_number && <p className="text-red-500 text-sm mt-1">{errors.card_number}</p>}
               </div>
               <div>
                   <input
                       type="text"
                       name="expiry_date"
                       placeholder="Expiry Date (MM/YY)"
                       value={cardDetails.expiry_date}
                       onChange={handleCardDetailsChange}
                       className="form-input rounded-md shadow-sm mt-1 block w-full"
                   />
                   {errors.expiry_date && <p className="text-red-500 text-sm mt-1">{errors.expiry_date}</p>}
               </div>
               <div>
                   <input
                       type="text"
                       name="cvv"
                       placeholder="CVV"
                       value={cardDetails.cvv}
                       onChange={handleCardDetailsChange}
                       className="form-input rounded-md shadow-sm mt-1 block w-full"
                   />
                   {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
               </div>
               <div>
                   <input
                       type="text"
                       name="cardholder_name"
                       placeholder="Cardholder Name"
                       value={cardDetails.cardholder_name}
                       onChange={handleCardDetailsChange}
                       className="form-input rounded-md shadow-sm mt-1 block w-full"
                   />
                   {errors.cardholder_name && <p className="text-red-500 text-sm mt-1">{errors.cardholder_name}</p>}
               </div>
           </div>
           <div className="mt-6  justify-center space-x-4">
               <button
            className="mb-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold ml-3 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
            onClick={handleCardPayment}
               >
                   Submit Payment
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

export default CardPayment;
