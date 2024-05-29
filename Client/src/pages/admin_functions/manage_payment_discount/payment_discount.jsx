import React from "react";
import '../../../App.css';
import Card from "../../../components/card";
import { MdAttachMoney } from "react-icons/md";
import { MdOutlineDiscount } from "react-icons/md";




const ManagePaymentDiscount = () => {
    return (
        <div className="main-content p-8 bg-gradient-to-r from-green-50 to-green-70 min-h-screen flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card
                    title="Manage Payments"
                    description="Edit and manage camp information"
                    navigateTo="/admin/manage_payment"
                    icon={<MdAttachMoney className="text-9xl text-green-600" />}
                />
                <Card 
                    title="Manage Discounts"
                    description="Edit and manage group information"
                    navigateTo="/admin/manage_discounts"
                    icon={<MdOutlineDiscount className="text-8xl text-blue-500" />}

                /> 
 
            </div>
   
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out" onClick={() => window.history.back()}>
                    Back
                </button>
    
        </div>
    );
}   

export default ManagePaymentDiscount;