import React,{ useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

function Adult_Pay() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const { user_id,
    price,
    camp_name,
    camp_id,
    group_id,
    group_name,
    start_date,
    end_date,
    registration_id } = location.state;

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
      pay_type: paymentMethod === 'card' ? 'Card' : 'Bank'
    };

    axios.post(`http://localhost:3000/campers/payment`, paymentData)
      .then(response => {
        const paymentId = response.data.payment_id;

        if (paymentMethod === 'card') {
          navigate('/adult_leader_functions/campers_card_payment', { state: { camp_name, group_name, camp_id, user_id, group_id, paymentId, registration_id, finalPrice } });
        } else if (paymentMethod === 'bank') {
          navigate(`/adult_leader_functions/bank_info_ad/${user_id}`, { state: { user_id, group_name, camp_name } });
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

        <h2 className="text-3xl font-bold mb-6">Pay to Join Camp: {camp_name}</h2>
        <div className="mb-6 text-2xl">
        <p><strong>Group Name: </strong>{group_name}</p>
        <p><strong>Start Date:  </strong>{formatDateDisplay(start_date)}</p>
        <p><strong>End Date:  </strong>{formatDateDisplay(end_date)}</p>
        <p><strong>Price:  </strong>${price}</p></div>
        {isEarlyBird && <p className="text-green-600">Early Bird Discount Available!</p>}
        
        <div className="payment-method">
                <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
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
            className="mb-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold ml-3 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
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
                    <p>Please email the proof of payment to kiwi_camp@gmail.com. Your group application will be processed once the payment is confirmed.</p>
                </div>
            )} */}
            <button
            className="mb-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold ml-3 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
            onClick={() => navigate(-1)} // Go back to the previous page
            >
                Back
            </button>
            </div>
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

export default Adult_Pay;
