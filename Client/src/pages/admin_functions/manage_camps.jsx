import React from "react";
import '../../App.css';
import Card from "../../components/card";
import { FcApproval } from "react-icons/fc";
import { GiForestCamp } from "react-icons/gi";
import { MdOutlineGroups2 } from "react-icons/md";


const ManageCamps = () => {
    return (
        <div className="main-content p-8 bg-gradient-to-r from-green-50 to-green-70 min-h-screen flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card
                    title="Manage Applications"
                    description="Approve or reject applications for camps or groups" 
                    navigateTo="/admin/manage_camps/manage_applications"
                    icon={<FcApproval className="text-8xl text-blue-500" />}
                />
                <Card
                    title="Manage Camps"
                    description="Edit and manage camp information"
                    navigateTo="/admin/manage_camps/manager_camps_info"
                    icon={<GiForestCamp className="text-9xl text-green-600" />}
                />
                <Card 
                    title="Manage Groups"
                    description="Edit and manage group information"
                    navigateTo="/admin/manage_camps/manage_groups"
                    icon={<MdOutlineGroups2 className="text-8xl text-blue-500" />}
                /> 
            </div>
   
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out" onClick={() => window.history.back()}>
                    Back
                </button>
    
        </div>
    );
}   

export default ManageCamps;