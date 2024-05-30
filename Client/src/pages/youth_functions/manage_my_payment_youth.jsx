import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ManageMyPaymentYouth = () => {
    const { user_id } = useParams();
    const [campsPayment, setCampsPayment] = useState([]);
    const [activitiesPayment, setActivitiesPayment] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [section, setSection] = useState('camps');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPayments = async () => {
            setIsLoading(true);
            try {
                if (section === 'camps') {
                    const campsResponse = await axios.get(`http://localhost:3000/campers/camp_payments/${user_id}`);
                    setCampsPayment(campsResponse.data);
                    setActivitiesPayment([]); // Clear activities payment when fetching camps payment
                } else {
                    const activitiesResponse = await axios.get(`http://localhost:3000/campers/activity_payments/${user_id}`);
                    setActivitiesPayment(activitiesResponse.data);
                    setCampsPayment([]); // Clear camps payment when fetching activities payment
                }
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayments();
    }, [user_id, section]); // Add section as a dependency to re-fetch payments on section change

    const handlePay = (payment) => {
        const state = section === 'camps'
            ? {
                camp_id: payment.camp_id,
                camp_name: payment.camp_name,
                group_name: payment.group_name,
                finalPrice: payment.amount,
                user_id,
                group_id: payment.group_id,
                paymentId: payment.payment_id,
                registration_id: payment.registration_id
            }
            : {
                activity_id: payment.activity_id,
                activity_name: payment.activity_name,
                group_name: payment.group_name,
                finalPrice: payment.amount,
                user_id,
                group_id: payment.group_id,
                paymentId: payment.payment_id,
                registration_id: payment.registration_id
            };

        navigate('/youth_camper_functions/campers_card_payment', { state });
    };

    const paymentsToShow = section === 'camps' ? campsPayment : activitiesPayment;
    const sortedPayments = paymentsToShow.sort((a, b) => a.payment_status === 'Unpaid' && a.pay_type ==='Card' ? -1 : 1);


    return (
        <div className="main-content"
        style={{
            backgroundImage: "url('/src/images/camp_bg2.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100vh'
          }}>
            <h1 className="text-xl font-bold mb-4">Manage My Payments</h1>
            <button
                className="bg-green-600 hover:bg-green-900 mb-3 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
                onClick={() => window.history.back()}
            >
                Back to dashboard
            </button>
            <div className="filter-buttons mb-4">
        
                <button
                    className={`px-4 py-2 mr-2 ${section === 'camps' ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded`}
                    onClick={() => setSection('camps')}
                >
                    Camp Payments
                </button>
                <button
                    className={`px-4 py-2 mr-2 ${section === 'activities' ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded`}
                    onClick={() => setSection('activities')}
                >
                    Activity Payments
                </button>
            </div>

            {isLoading ? (
                <p>Loading payments...</p>
            ) : (
                <div className="payment-list mt-4">
                    {sortedPayments.length === 0 ? (
                        <p>No payments found</p>
                    ) : (
                        <table className="table-auto w-full text-left whitespace-no-wrap">
                            <thead>
                                <tr className="font-semibold text-gray-700 bg-gray-100">
                                    <th className="px-2 py-3">Pay for:</th>
                                    <th className="px-2 py-3">Amount</th>
                                    <th className="px-2 py-3">Request Date</th>
                                    <th className="px-2 py-3">Payment Description</th>
                                    <th className="px-2 py-3">Payment Status</th>
                                    <th className="px-2 py-3">Payment Type</th>
                                    <th className="px-2 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedPayments.map(payment => (
                                    <tr key={payment.payment_id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-2 py-3">{section === 'camps' ? payment.camp_name : payment.activity_name}</td>
                                        <td className="px-2 py-3">$ {payment.amount}</td>
                                        <td className="px-2 py-3">{formatDateDisplay(payment.request_date)}</td>
                                        <td className="px-2 py-3">{payment.description}</td>
                                        <td className="px-2 py-3">{payment.payment_status}</td>
                                        <td className="px-2 py-3">{payment.pay_type}</td>
                                        <td className="px-2 py-3">
                                            {payment.payment_status === 'Unpaid' && payment.pay_type !== 'Bank' && (
                                                <button 
                                                    onClick={() => handlePay(payment)}
                                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    Pay
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

        </div>
    );

    function formatDateDisplay(dateStr) {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
        }
        return "Invalid date";
    }
};

export default ManageMyPaymentYouth;
