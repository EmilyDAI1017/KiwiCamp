import React from "react";
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import Card from "../../components/card"; 
const Gl_Groups = () => {
    const { user, logout } = useUser();
    return (
        <div className="main-content p-8 bg-gradient-to-r from-green-50 to-green-70 min-h-screen flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card
                    f_name="My groups"
                    navigateTo= {`/group_leader_functions/groups/group_apply/${user.id}`}
                    // icon={<FaUsersGear className="text-8xl text-blue-500" />}
                    bgImage='/src/images/leaf.jpg'
                    className="mb-55 flex justify-center text-3xl text-white"
                />
                <Card
                    title="Manage Team"
                    description="Edit and manage manager/staff accounts"
                    navigateTo="/admin/manage_users/manage_teams"
                    // icon={<SiStaffbase className="text-8xl text-green-600" />}
                />
            </div>
            <div>
                <button className="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out" onClick={() => window.history.back()}>
                    Back
                </button>
            </div>
        </div>
    );
}

export default Gl_Groups;