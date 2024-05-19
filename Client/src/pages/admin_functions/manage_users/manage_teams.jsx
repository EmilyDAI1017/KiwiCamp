import React from 'react';
import Card from "../../../components/card";
import '../../../App.css';
import { FcManager } from "react-icons/fc";
import { BsMicrosoftTeams } from "react-icons/bs";


function ManageTeams() {
    return (
        <div className="main-content p-8 bg-gradient-to-r from-green-50 to-green-70 min-h-screen flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card
                    title="Manage managers accounts"
                    description="Edit and manage managers accounts"
                    navigateTo="/admin/manage_users/manage_managers"
                    icon={<FcManager className="text-8xl text-blue-500" />}
                />
                <Card
                    title="Manage staff accounts"
                    description="Edit and manage staff accounts"
                    navigateTo="/admin/manage_users/manage_staff"
                    icon={<BsMicrosoftTeams className="text-9xl text-green-600" />}
                />
            </div>
   
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out" onClick={() => window.history.back()}>
                    Back
                </button>
    
        </div>
    );
}

export default ManageTeams;
