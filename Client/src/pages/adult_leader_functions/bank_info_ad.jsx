import React, {useState} from "react";
import "../../App.css";
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const BankInfoAd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const{ user_id } = useParams();
    const { camp_name, group_name } = location.state;
    return (
        <div className="main-content flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
                <h1 className="text-2xl font-bold text-green-600 mb-4">Bank Transfer Information</h1>
                <p className="text-green-800 mb-2"> </p>
                <p className="text-green-700 mb-2">
                <p><strong>Account Name:</strong> Kiwi Camp</p>
                <p><strong>Account Number:</strong> 1000-1000-1000-1000</p>
                <p><strong>Reference:</strong> {`${group_name}-${camp_name}-${user_id}`}</p>
                </p>
                <p className="text-green-600 mb-2">
                Please email the proof of payment to kiwi_camp@gmail.com. Your camp registration will be processed once the payment is confirmed.                
                </p>
                <p className="text-green-500 mb-4">
                You will see the camps showing on your dashboard once you registered the camp successfully after payment.
                </p>
                <button
                    className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => navigate(`/adult_leader_dashboard/${user_id}`)} // Go back to the previous page
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default BankInfoAd;
