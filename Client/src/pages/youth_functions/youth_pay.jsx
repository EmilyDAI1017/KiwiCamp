import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

function Youth_Pay() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const {
    user_id,
    price,
    camp_name,
    camp_id,
    group_id,
    group_name,
    start_date,
    end_date,
    registration_id
  } = location.state;

  const currentDate = new Date();
  const campStartDate = new Date(start_date);
  const earlyBirdDate = new Date(campStartDate);
  earlyBirdDate.setDate(campStartDate.getDate() - 30);
  const isEarlyBird = currentDate <= earlyBirdDate;

  useEffect(() => {
    // Fetch the "Early bird" discount percentage
    axios.get(`http://localhost:3000/camp/discount/${camp_id}`)
      .then(response => {
        const discount = response.data.discount_percentage;
        setDiscountPercentage(discount || 0);
      })
      .catch(error => {
        console.error('Error fetching discount percentage:', error);
      });
  }, [camp_id]);

  const handlePayment = () => {
    let finalPrice = price;
    if (isEarlyBird && discountPercentage > 0) {
      finalPrice = price * (1 - discountPercentage / 100); // Apply discount
    }

    const paymentData = {
      user_id,
      camp_id,
      amount: finalPrice,
      request_date: new Date().toISOString().split('T')[0], // current date in YYYY-MM-DD format
      description: `Payment for ${camp_name}, Group: ${group_name}`,
      payment_status: 'Unpaid',
      payment_date: null,
      pay_type: paymentMethod === 'Card' ? 'Card' : 'Bank'
    };

    axios.post(`http://localhost:3000/campers/payment`, paymentData)
      .then(response => {
        const paymentId = response.data.payment_id;

        if (paymentMethod === 'Card') {
          navigate('/youth_camper_functions/campers_card_payment', { state: { camp_id, camp_name, group_name, user_id, group_id, paymentId, registration_id, finalPrice } });
        } else if (paymentMethod === 'Bank') {
          navigate(`/youth_camper_functions/bank_info_youth/${user_id}`, { state: { user_id, group_name, camp_name } });
        }
      })
      .catch(error => {
        console.error('Error creating payment record:', error);
        alert('Failed to create payment record.');
      });
  };

  return (
    <div className="main-content bg-cover p-6 min-h-screen flex flex-col items-center justify-start columns-8xs">
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6">Pay to Join Camp: {camp_name}</h2>
        <p>Group Name: {group_name}</p>
        <p>Start Date: {formatDateDisplay(start_date)}</p>
        <p>End Date: {formatDateDisplay(end_date)}</p>
        <p>Price: ${price}</p>
        {isEarlyBird && discountPercentage > 0 && (
          <p className="text-green-600">Early Bird Discount: {discountPercentage}%</p>
        )}
      </div>

      <div className="payment-method">
        <h2>Select Payment Method</h2>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'Card'}
            onChange={() => {
              setPaymentMethod('Card');
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
            checked={paymentMethod === 'Bank'}
            onChange={() => {
              setPaymentMethod('Bank');
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
      {/* {showBankInfo && (
        <div className="bank-info mt-4">
          <h3>Bank Transfer Information</h3>
          <p><strong>Account Name:</strong> Kiwi Camp</p>
          <p><strong>Account Number:</strong> 1000-1000-1000-1000</p>
          <p><strong>Reference:</strong> {`${group_name}-${camp_name}-${user_id}`}</p>
          <p>Please email the proof of payment to kiwi_camp@gmail.com.</p>
        </div>
      )} */}
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
        onClick={() => navigate(-1)} // Go back to the previous page
      >
        Back
      </button>
    </div>
  );

  function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
    return "Invalid date";
  }
}

export default Youth_Pay;
