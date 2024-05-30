import React from "react";
import Card from "../../components/card"; // Ensure this is the updated Card component with navigation
import '../../App.css';
import { useParams } from 'react-router-dom';
import { FaUser, FaCampground, FaTasks, FaNewspaper, FaMapMarkedAlt } from 'react-icons/fa';
import { MdHotel, MdLocalOffer, MdAssessment } from 'react-icons/md';

const Staff_Dashboard = () => {  
  const { id } = useParams();
  const user_id = id;
  return (
    <div className="main-content mp-3  bg-gradient-to-r from-green-70 to-green-90 min-h-screen flex flex-col items-center justify-start columns-8xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-12">

      <Card 
            title="My Profile"
            description="Edit and manage your profile"
            navigateTo={`/staff_profile/${user_id}`}
            icon={<FaUser className="text-8xl text-yellow-500" />}
          />

   <    Card 
          title="Manage Grounds" 
          description="Edit and manage grounds" 
          navigateTo="/staff_functions/view_grounds"
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
      

</div>
    </div>
  );
}

export default Staff_Dashboard;