import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const ManageMyPaymentGroupLeader = () => {
    const { user_id } = useParams();
    const [campsPayment, setCampsPayment] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        axios.get(`http://localhost:3000/group_leader/payments/${user_id}`)
            .then(response => {
                console.log('Camps Payment:', response.data);
                setCampsPayment(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching camp payments:', error);
                setIsLoading(false);
            });

    }, [user_id]);

    const handlePay = (paymentId, campId, campName, groupName, amount, userId, groupId, registrationId) => {
        navigate('/card_payment', {
            state: {
                camp_id: campId,
                camp_name: campName,
                group_name: groupName,
                finalPrice: amount,
                user_id: userId,
                group_id: groupId,
                paymentId: paymentId,
            }
        });
    };

    const sortedPayments = campsPayment.sort((a, b) => a.payment_status === 'Unpaid' && a.pay_type === 'Card' ? -1 : 1);

    return (
        <div className="main-content bg-cover bg-center bg-no-repeat p-8" style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')" }}>
            <div className="container mx-auto bg-white bg-opacity-70 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl text-green-700 font-bold mb-6">Manage My Payments</h1>

                {isLoading ? (
                    <p>Loading payments...</p>
                ) : (
                    <div className="overflow-x-auto">
                        {sortedPayments.length === 0 ? (
                            <p>No payments found</p>
                        ) : (
                            <table className="table-auto w-full text-left whitespace-no-wrap">
                                <thead>
                                    <tr className="font-semibold text-green-700 bg-gray-100">
                                        <th className="px-4 py-3">Pay for</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3">Request Date</th>
                                        <th className="px-4 py-3">Payment Description</th>
                                        <th className="px-4 py-3">Payment Status</th>
                                        <th className="px-4 py-3">Payment Type</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campsPayment.map(payment => (
                                        <tr key={payment.payment_id} className="bg-white/90 border-b hover:bg-green-50">
                                            <td className="px-4 py-3">{payment.camp_name}</td>
                                            <td className="px-4 py-3">$ {payment.amount}</td>
                                            <td className="px-4 py-3">{formatDateDisplay(payment.request_date)}</td>
                                            <td className="px-4 py-3">{payment.description}</td>
                                            <td className="px-4 py-3">{payment.payment_status}</td>
                                            <td className="px-4 py-3">{payment.pay_type}</td>
                                            <td className="px-4 py-3">
                                                {payment.payment_status === 'Unpaid' && payment.pay_type !== 'Bank' && (
                                                    <button
                                                        onClick={() => handlePay(
                                                            payment.payment_id, payment.camp_id, payment.camp_name, payment.group_name, payment.amount, user_id, payment.group_id, payment.description
                                                        )}
                                                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition duration-200"
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
                <button
                    className="mt-5 bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
                    onClick={() => window.history.back()}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );

    function formatDateDisplay(dateStr) {
        if (!dateStr) return "N/A"; // Return "N/A" or any default text for null dates
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
        }
        return "Invalid date";
    }
};

export default ManageMyPaymentGroupLeader;
