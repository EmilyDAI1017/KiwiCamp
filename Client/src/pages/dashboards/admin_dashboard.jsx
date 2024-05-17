import React from 'react';
import Card from "../../components/card"; // Ensure this is the updated Card component with navigation
import '../../App.css';
import { FaUser, FaCampground, FaTasks, FaNewspaper, FaMapMarkedAlt } from 'react-icons/fa';
import { MdHotel, MdLocalOffer, MdAssessment } from 'react-icons/md';

function Admin_Dashboard() {
  return (
    <div className="main-content p-8 bg-gradient-to-r from-green-50 to-green-70 min-h-screen columns-8xs">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-6">
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
          title="Manage Camps" 
          description="Edit and manage camp details and manage camp applications" 
          navigateTo="/admin/manage_camps"
          icon={<FaCampground className="text-8xl text-green-600"/>}
        />
        <Card 
          title="Manage Activities" 
          description="Edit and manage activity details" 
          navigateTo="/admin/manage_activities"
          icon={<FaTasks className="text-8xl text-purple-500"/>}
        />
        <Card 
          title="Manage Accommodations" 
          description="Edit and manage accommodation details" 
          navigateTo="/admin/manage_accommodations"
          icon={<MdHotel className="text-8xl text-teal-500"/>}
        />
        <Card 
          title="Discount Management" 
          description="Edit and manage discounts" 
          navigateTo="/admin/discount_management"
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
