import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "../../App.css";

const PayForActivities = () => {
    const { user_id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { camp_id, total_cost, activity_names } = location.state;
    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = () => {
        setIsLoading(true);
        const paymentDate = new Date().toISOString().split('T')[0];
        
        axios.post(`http://localhost:3000/campers/payment`, {
            user_id,
            camp_id,
            amount: total_cost,
            request_date: paymentDate,
            description: `Payment for activities: ${activity_names.join(', ')}`,
            payment_status: 'Unpaid',
            payment_date: null,
            pay_type: paymentMethod === 'Card' ? 'Card' : 'Bank'
        })
        .then(response => {
            const paymentId = response.data.payment_id;

          if (paymentMethod === 'Card') {
          navigate('/youth_camper_functions/activity_card_payment', { state: { camp_id, user_id, paymentId, activity_names, total_cost} });
        } else if (paymentMethod === 'Bank') {
          navigate(`/youth_camper_functions/bank_info_youth/${user_id}`, { state: { user_id, group_name: activity_names, camp_name:camp_id , total_cost} });
        }

        })
        .catch(error => {
            console.error('Error processing payment:', error);
            alert('Failed to complete payment');
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div className="main-content">
            <h1 className="text-xl font-bold mb-4">Complete Payment</h1>
            <p><strong>Total Cost:</strong> ${total_cost.toFixed(2)}</p>
            <p><strong>Activities:</strong> {activity_names.join(', ')}</p>
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
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Complete Payment'}
            </button>
        </div>
    );
}

export default PayForActivities;
