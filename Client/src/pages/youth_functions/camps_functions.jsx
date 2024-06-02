import React from "react";
import '../../App.css';
import Card from "../../components/card";
import { FcApproval } from "react-icons/fc";
import { GiForestCamp } from "react-icons/gi";
import { MdOutlineGroups2 } from "react-icons/md";
import { useParams } from "react-router-dom";


const MyCamps = () => {
    const { user_id } = useParams();
    return (
        <div className="main-content p-8 bg-gradient-to-r from-green-50 to-green-70 min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')",
                height: '100vh'
        }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card
                    title="View my Camps and choose activities "
                    description="Camps details and activities selection"
                    navigateTo={`/camper_functions/my_camps/${user_id}`}
                    icon={<GiForestCamp className="text-9xl text-green-600" />}
                />
                <Card 
                    title="View my teams and accommodations"
                    description="View teams and accommodations information"
                    navigateTo={`/camps_functions/teams_and_accommodations/${user_id}`}
                    icon={<MdOutlineGroups2 className="text-8xl text-blue-500" />}

                /> 
            </div>
            <div >
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out" onClick={() => window.history.back()}>
                    Back
                </button>
            </div>
    
        </div>
    );
}   

export default MyCamps;