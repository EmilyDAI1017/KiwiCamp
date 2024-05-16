import React from "react";
import Card from "../../components/card";
import { FaUsersGear } from "react-icons/fa6";
import { SiStaffbase } from "react-icons/si";

function ManageUsers() {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                <Card
                    title="Manage Campers"
                    description="Edit and manage campers accounts"
                    navigateTo="/admin/manage_users/campers"
                    icon={<FaUsersGear className="text-4xl text-blue-500" />}
                />
                <Card
                    title="Manage Staff"
                    description="Edit and manage staff accounts"
                    navigateTo="/admin/manage_users/staff"
                    icon={<SiStaffbase className="text-3xl text-green-600" />}
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

export default ManageUsers;
