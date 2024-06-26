import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "../../App.css";

const PayForActivities = () => {
    const { user_id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { total_cost, activities } = location.state;
    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = () => {
        setIsLoading(true);
        const paymentDate = new Date().toISOString().split('T')[0];
        const campNames = activities.map(activity => activity.camp_name).join(', ');
        const activityNames = activities.map(activity => activity.name).join(', ');

        console.log(activities.map(activity => activity.camp_id));  

        axios.post(`http://localhost:3000/campers/payment`, {
            user_id,
            camp_id: 1,
            amount: total_cost,
            request_date: paymentDate,
            description: `Payment for activities at camps: ${campNames}. Activities: ${activityNames}`,
            payment_status: 'Unpaid',
            payment_date: null,
            pay_type: paymentMethod === 'Card' ? 'Card' : 'Bank'
        })
        .then(response => {
            const paymentId = response.data.payment_id;

            if (paymentMethod === 'Card') {
                navigate('/youth_camper_functions/activity_card_payment', {
                    state: {
                        user_id,
                        paymentId,
                        camp_names: campNames,
                        activity_names: activityNames,
                        total_cost
                    }
                });
            } else if (paymentMethod === 'Bank') {
                navigate(`/youth_camper_functions/bank_info_youth/${user_id}`, {
                    state: {
                        user_id,
                        group_name: activityNames,
                        camp_name: campNames,
                        total_cost
                    }
                });
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
      <div className="main-content p-8 bg-gradient-to-r from-green-50 to-green-70 min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')",
              height: '100%'
      }}
      >
        <div className="bg-white/80 p-8 rounded shadow-lg">
            <h1 className="text-xl font-bold mb-4">Complete Payment</h1>
            <p><strong>Total Cost:</strong> ${total_cost.toFixed(2)}</p>
            <div className="mb-4">
                <h2 className="text-lg font-bold">Pay for:</h2>
                {activities.map((activity, index) => (
                    <div key={index} className="mb-2">
                        <p><strong>Camp Name:</strong> {activity.camp_name}</p>
                        <p><strong>Activity Name:</strong> {activity.name}</p>
                    </div>
                ))}
            </div>
            <div className="payment-method">
                <h2>Select Payment Method</h2>
                <label>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="Card"
                        checked={paymentMethod === 'Card'}
                        onChange={() => setPaymentMethod('Card')}
                        className="mr-2"
                    />
                    Pay by Card
                </label>
                <label className="ml-4">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="Bank"
                        checked={paymentMethod === 'Bank'}
                        onChange={() => setPaymentMethod('Bank')}
                        className="mr-2"
                    />
                    Bank Transfer
                </label>
            </div>
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
                onClick={handlePayment}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Complete Payment'}
            </button>
        </div>
    </div>
    );
}

export default PayForActivities;
