import React, { useEffect, useState } from 'react';
import Card from "../../components/card";
import '../../App.css';
import { useUser } from '../../contexts/UserContext';
import { FaUser, FaUsers, FaCampground, FaTasks, FaNewspaper, FaMapMarkedAlt } from 'react-icons/fa';
import { MdHotel, MdLocalOffer, MdAssessment } from 'react-icons/md';
import Sidebar from '../../components/navbar_dash'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Group_Leader_Dashboard() {
  const { user, logout } = useUser();
  console.log(user);
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [pendingGroups, setPendingGroups] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetchNews(user.id);
      fetchPendingGroups(user.id);
    }
  }, [user?.id]);

  const fetchNews = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/group_leader_dashboard/news/${userId}`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchPendingGroups = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/group_leader/groups_unpaid/${userId}`);
      setPendingGroups(response.data);
    } catch (error) {
      console.error('Error fetching pending groups:', error);
    }
  };

  const handlePay = (group, camp) => {
    navigate('/groups/payment', { state: { group, camp: group, user_id: user.id, group_id: group.group_id, camp_name: group.camp_name, price: group.price } });
  };

  return (
    <div className="main-content bg-cover p-6 min-h-screen flex flex-col items-center justify-start columns-8xs" style={{ backgroundImage: "url('/src/images/group_leader.png')" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
        
        <div className="mt-12 w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Latest News</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-96">
            {news.length > 0 ? 
            (
              news.map((item) => (
                <div key={item.news_id} className="mb-4">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-700">{item.content}</p>
                  <p className="text-sm text-gray-500">{formatDateDisplay(item.publish_date)}</p>
                </div>
              ))
            ) : (
              <p>No news available.</p>
            )}
          </div>
        </div>

        <PendingGroupsBlock pendingGroups={pendingGroups} handlePay={handlePay} />

        <Card 
          title="My Profile"
          description="Edit and manage your profile"
          navigateTo={`/group_leader_profile/${user?.id}`}
          icon={<FaUser className="text-8xl text-blue-500"/>}
          image="https://images.pexels.com/photos/163097/twitter-social-media-communication-internet-network-163097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        />
        <Card 
          title="My Groups" 
          description="Manage your groups" 
          navigateTo={`/group_leader_functions/groups/group_apply/${user?.id}`}
          icon={<FaUsers className="text-8xl text-green-500"/>}
        />
        <Card 
          title="Camps" 
          description="View and manage camps" 
          navigateTo="/group_leader_camps"
          icon={<FaCampground className="text-8xl text-teal-500"/>}
        />
        <Card 
          title="Activities" 
          description="Register for activities" 
          navigateTo="/group_leader_activities"
          icon={<FaTasks className="text-8xl text-purple-500"/>}
        />
        <Card 
          title="Accommodations" 
          description="Manage your accommodations" 
          navigateTo="/group_leader_accommodations"
          icon={<MdHotel className="text-8xl text-pink-500"/>}
        />
        <Card 
          title="Discounts" 
          description="View available discounts" 
          navigateTo="/group_leader_discounts"
          icon={<MdLocalOffer className="text-8xl text-orange-500"/>}
        />
        <Card 
          title="Payment" 
          description="Check due payments and make payments"  
          navigateTo="/group_leader_reports"
          icon={<MdAssessment className="text-8xl text-red-500"/>}
        />
      </div>
    </div>
  );

  function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
    return "Invalid date";
  }
}

function PendingGroupsBlock({ pendingGroups, handlePay }) {
  return (
    <div className="mt-12 w-full max-w-4xl">
      <h2 className="text-3xl font-bold mb-6">Unpaid Group Applications</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-96">
        {pendingGroups.length > 0 ? (
          pendingGroups.map((group) => (
            <div key={group.group_id} className="mb-4">
              <h3 className="text-xl font-semibold">{group.group_name}</h3>
              <p className="text-gray-700">Description: {group.description}</p>
              <p className="text-sm text-gray-500">{`Number of Attendees: ${group.number_of_attendees}`}</p>
              <p className="text-sm text-gray-500">{`Camp Name: ${group.camp_name}`}</p>
              <p className="text-sm text-gray-500">{`Price: $ ${group.price}`}</p>
              <p className="text-sm text-gray-500">{`Status: ${group.group_status}`}</p>
              <p className="text-sm text-gray-500">{`Payment Status: ${group.payment_status}`}</p>
              <button
                onClick={() => handlePay(group, { camp_id: group.camp_id })}
                className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Pay
              </button>
            </div>
          ))
        ) : (
          <p>No pending group applications.</p>
        )}
      </div>
    </div>
  );
}

export default Group_Leader_Dashboard;
