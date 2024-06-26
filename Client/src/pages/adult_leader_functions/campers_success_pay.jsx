import React from "react";
import "../../App.css";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext";  
import { useState } from "react";

const CamperSuccessPay = () => {
    const navigate = useNavigate();
    const{ user_id } = useParams();
    const { user } = useUser();
    const role = user?.role;
    console.log(role);
    const location = useLocation();
    const { camp_name, group_name } = location.state;
    const getDashboardUrl = (role) => {
        switch (role) {
            case 'Adult Leader':
                return `/adult_leader_dashboard/${user_id}`;
            case 'Youth':
                return `/youth_camper_dashboard/${user_id}`;
            default:
                return `/dashboard/${user_id}`; // Default dashboard if role is not matched
        }
    };

    return (
        <div className="main-content flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
                <h1 className="text-2xl font-bold text-green-600 mb-4">Congratulations!</h1>
                <p className="text-green-400 mb-2">
                You have now joined the group {group_name} for the camp {camp_name} successfully!
                </p>
                <p className="text-green-500 mb-2">
                Thank you for your payment.
                </p>
                <p className="text-green-600 mb-2">
                You are ready to the camp.               
                </p>
                <p className="text-green-700 mb-4">
                You can see your camp's details, your team with the youth campers from your dashboard!          
                </p>
                <button
                    className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => navigate(getDashboardUrl(role))} // Navigate to the correct dashboard based on role
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default CamperSuccessPay;
