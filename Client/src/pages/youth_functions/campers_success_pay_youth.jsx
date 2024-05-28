import React from "react";
import "../../App.css";
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const CamperSuccessPayYouth = () => {
    const navigate = useNavigate();
    const{ user_id } = useParams();
    const location = useLocation();
    const { camp_name, group_name } = location.state;
    return (
        <div className="main-content flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
                <h1 className="text-2xl font-bold text-green-600 mb-4">Congratulations!</h1>
                <p className="text-green-400 mb-2">
                  Congratulations! You have joined the group {group_name} for the camp {camp_name} successfully!
                </p>
                <p className="text-green-500 mb-2">
                Thank you for your payment.
                </p>
                <p className="text-green-600 mb-2">
                 You are ready to the camp.                </p>
                <p className="text-green-700 mb-4">
                   You can see your camp's details and manage activities from your dashboard!              </p>
                    <button
          className="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={() => navigate(`/youth_camper_dashboard/${user_id}`)} // Go back to the previous page
        >
          Back to dashboard
        </button>
            </div>
        </div>
    );
}

export default CamperSuccessPayYouth;
