import React from 'react';
import Card from "../../components/card"; // Ensure this is the updated Card component with navigation
import '../../App.css';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { FaUser, FaUsers, FaCampground, FaTasks, FaNewspaper, FaMapMarkedAlt } from 'react-icons/fa';
import { MdHotel, MdLocalOffer, MdAssessment } from 'react-icons/md';
import Sidebar from '../../components/navbar_dash'; 


function Group_Leader_Dashboard() {
  const { user, logout } = useUser();
  return (
    
    <div className="main-content bg-cover p-6 min-h-screen flex flex-col items-center justify-start columns-8xs" style={{ backgroundImage: "url('/src/images/group_leader.png')" }}>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
        <Card 
   
          title="My Profile"
          description= "Edit and manage your profile"
          navigateTo ={`/group_leader_profile/${user.id}`}
          icon = {<FaUser className="text-8xl text-blue-500"/>}
          image= "https://images.pexels.com/photos/163097/twitter-social-media-communication-internet-network-163097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

        />
         <Card 
          title="My Groups" 
          description="Manage your groups" 
          navigateTo={`/group_leader_functions/gl_groups/${user.id}`}
          icon={<FaUsers className="text-8xl text-green-500"/>}
          className="col-span-1"
        />
        <Card 
          title="Camps" 
          description="View and manage camps" 
          navigateTo="/group_leader_camps"
          icon={<FaCampground className="text-8xl text-teal-500"/>}
          className="col-span-1 md:col-span-1 lg:col-span-2"
        />
          <Card 
          title="Activities" 
          description="Register for activities" 
          navigateTo="/group_leader_activities"
          icon={<FaTasks className="text-8xl text-purple-500"/>}
          className="col-span-1"
        />
        <Card 
          title="Accommodations" 
          description="Manage your accommodations" 
          navigateTo="/group_leader_accommodations"
          icon={<MdHotel className="text-8xl text-pink-500"/>}
          className="col-span-1 md:col-span-2 lg:col-span-1"
        />
        <Card 
          title="Discounts" 
          description="View available discounts" 
          navigateTo="/group_leader_discounts"
          icon={<MdLocalOffer className="text-8xl text-orange-500"/>}
          className="col-span-1"
        />
        <Card 
          title="News" 
          description="Read the latest news" 
          navigateTo="/group_leader_news"
          icon={<FaNewspaper className="text-8xl text-yellow-500"/>}
          className="col-span-1 md:col-span-2 lg:col-span-1"
        />
        <Card 
          title="Payment" 
          description="Check due payments and make payments"  
          navigateTo="/group_leader_reports"
          icon={<MdAssessment className="text-8xl text-red-500"/>}
          className="col-span-1"
        />
    
      </div>
    </div>
  );
}




export default Group_Leader_Dashboard;
