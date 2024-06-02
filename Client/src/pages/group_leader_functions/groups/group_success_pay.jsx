import React from "react";
import "../../../App.css";
import { useParams, useNavigate } from 'react-router-dom';

const SuccessPay = () => {
    const navigate = useNavigate();
    const{ user_id } = useParams();
    return (
        <div className="main-content flex items-center justify-center min-h-screen bg-gray-100"
        style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100%'}}
        >
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
                <h1 className="text-2xl font-bold text-green-600 mb-4">Congratulations!</h1>
                <p className="text-green-400 mb-2">
                    Thank you for your payment. Your group application has been submitted successfully.
                </p>
                <p className="text-green-500 mb-2">
                    Our team will check your group application and approve it as soon as possible.
                </p>
                <p className="text-green-600 mb-2">
                    Once your group has been approved, you will receive a message shown on your dashboard.
                </p>
                <p className="text-green-700 mb-4">
                    Then you can manage your approved groups.
                </p>
                <button
            className="mb-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold ml-3 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
            onClick={() => navigate(`/group_leader_dashboard/${user_id}`)} // Go back to the previous page
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default SuccessPay;
