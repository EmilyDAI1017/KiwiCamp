import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from "../../../components/card";
import { TbMoodKid } from "react-icons/tb";
import { MdEmojiPeople } from "react-icons/md";


function ManageUsersCampers() {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                <Card
                    title="Youth Campers"
                    description="Edit and manage youth campers accounts"
                    navigateTo="/admin/manage_users/manage_youth"
                    icon={<TbMoodKid className="text-4xl text-blue-500" />}
                />
                <Card
                    title="Leaders"
                    description="Edit and manage group/audlt leaders accounts"
                    navigateTo="/admin/manage_users/manage_leaders"
                    icon={<MdEmojiPeople className="text-4xl text-green-600" />}
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


export default ManageUsersCampers;