import React from 'react';
import Card from "../../components/card"; // Ensure this is the updated Card component with navigation
import '../../App.css';
import { Link } from 'react-router-dom';
import { FaUser, FaCampground, FaTasks, FaNewspaper, FaMapMarkedAlt } from 'react-icons/fa';
import { MdHotel, MdLocalOffer, MdAssessment } from 'react-icons/md';



function Admin_Dashboard() {
  return (
      <div class="main-content">
          <Card 
              title="Manage Users" 
              description="Edit and manage user accounts" 
              navigateTo="/admin/manage_users"
              icon={<FaUser className="text-3xl text-blue-500"/>}

          />
        <Card 
              title="Manage Grounds" 
              description="Edit and manage grounds" 
              navigateTo="/admin/manage_grounds"
              icon={<FaMapMarkedAlt className="text-3xl text-red-500"/>}
          />
            <Card 
                title="Manage Camps" 
                description="Edit and manage camp details and manage camp apllications" 
                navigateTo="/admin/manage_camps"
                icon={<FaCampground className="text-3xl text-green-600"/>}
            />
            <Card 
                title="Manage Activities" 
                description="Edit and manage activity details" 
                navigateTo="/admin/manage_activities"
                icon={<FaTasks className="text-3xl text-purple-500"/>}
            />
            <Card 
                title="Manage Accomodations" 
                description="Edit and manage accomodation details" 
                navigateTo="/admin/manage_accomodations"
                icon={<MdHotel className="text-3xl text-teal-500"/>}
            />
            <Card 
                title="Discount Management" 
                description="Edit and manage discounts" 
                navigateTo="/admin/discount_management"
                icon={<MdLocalOffer className="text-3xl text-orange-500"/>}
            />
            <Card 
                title="News Edit" 
                description="Edit and manage news articles" 
                navigateTo="/admin/news_edit"
                icon={<FaNewspaper className="text-3xl text-yellow-600"/>}
            />
            <Card 
                title="Report Generate" 
                description="Generate reports" 
                navigateTo="/admin/report_generate"
                icon={<MdAssessment className="text-3xl text-green-500"/>}

            />
            
      </div>
  );
}


export default Admin_Dashboard;