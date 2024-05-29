import React from 'react';
import Card from "../../components/card"; // Ensure this is the updated Card component with navigation
import '../../App.css';
import { FaUser, FaCampground, FaTasks, FaNewspaper, FaMapMarkedAlt } from 'react-icons/fa';
import { MdHotel, MdLocalOffer, MdAssessment } from 'react-icons/md';

function Admin_Dashboard() {
  return (
    
    <div className="main-content mp-3  bg-gradient-to-r from-green-70 to-green-90 min-h-screen flex flex-col items-center justify-start columns-8xs">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-12">
        <Card 
          title="Manage Users" 
          description="Edit and manage user accounts" 
          navigateTo="/admin/manage_users"
          icon={<FaUser className="text-8xl text-blue-500"/>}
    
        />
        <Card 
          title="Manage Grounds" 
          description="Edit and manage grounds" 
          navigateTo="/admin/manage_grounds"
          icon={<FaMapMarkedAlt className="text-8xl text-red-500"/>}
        />
        <Card 
          title="Camps and Groups " 
          description="Edit and manage camps and groups" 
          navigateTo="/admin/manage_camps"
          icon={<FaCampground className="text-8xl text-green-600"/>}
        />
        <Card 
          title="Manage Activities" 
          description="Edit and manage activity details" 
          navigateTo="/admin/activities"
          icon={<FaTasks className="text-8xl text-purple-500"/>}
        />
        <Card 
          title="Manage Accommodations" 
          description="Edit and manage accommodation details" 
          navigateTo="/admin/manage_accommodations"
          icon={<MdHotel className="text-8xl text-teal-500"/>}
        />
        <Card 
          title="Manage Payment and Discount" 
          description="Edit and manage discounts" 
          navigateTo="/admin/manage_payment_discount"
          icon={<MdLocalOffer className="text-8xl text-orange-500"/>}
        />
        <Card 
          title="News Edit" 
          description="Edit and manage news articles" 
          navigateTo="/admin/news_edit"
          icon={<FaNewspaper className="text-8xl text-yellow-600"/>}
        />
        <Card 
          title="Report Generate" 
          description="Generate reports" 
          navigateTo="/admin/report_generate"
          icon={<MdAssessment className="text-8xl text-green-500"/>}
        />
      </div>
    </div>
  );
}

export default Admin_Dashboard;
