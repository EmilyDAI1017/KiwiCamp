import React from "react";
import '../../App.css';
import Card from "../../components/card";
import { FcApproval } from "react-icons/fc";
import { GiForestCamp } from "react-icons/gi";
import { MdOutlineGroups2 } from "react-icons/md";
import { MdOutlineLocalActivity } from "react-icons/md";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";


const Activities = () => {
    return (
        <div className="main-content p-8 bg-gradient-to-r from-green-50 to-green-70 min-h-screen flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <Card
                    title="Manage Activities"
                    description="Edit and manage activity information"
                    navigateTo="/admin/manage_activities"
                    icon={<MdOutlineLocalActivity className="text-9xl text-green-600" />}
                />
                <Card 
                    title="Assign Activities to Camps"
                    description="Assign the activities to the camps"
                    navigateTo="/admin/assign_ac_to_camps"
                    icon={<MdOutlineAssignmentTurnedIn className="text-8xl text-blue-500" />}

                /> 
            </div>
   
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out" onClick={() => window.history.back()}>
                    Back
                </button>
    
        </div>
    );
}   

export default Activities;