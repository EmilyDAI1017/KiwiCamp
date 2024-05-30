import React, { useEffect, useState } from 'react';
import Card from "../../components/card";
import '../../App.css';
import { useUser } from '../../contexts/UserContext';
import { FaUser, FaUsers, FaCampground, FaTasks, FaNewspaper, FaMapMarkedAlt } from 'react-icons/fa';
import { MdHotel, MdLocalOffer, MdAssessment } from 'react-icons/md';
import Sidebar from '../../components/navbar_dash'; 
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Group_Leader_Dashboard() {
  const { user, logout } = useUser();
  console.log(user);
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [pendingGroups, setPendingGroups] = useState([]);
  const [unpaidCampsBank, setUnpaidCampsBank] = useState([]);



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
      const response = await axios.get(`http://localhost:3000/campers/unpaid_camps/${userId}`);
      setPendingGroups(response.data);
    } catch (error) {
      console.error('Error fetching pending groups:', error);
    }
  };



  return (
    <div className="main-content h-screen bg-cover bg-no-repeat p-6 flex flex-col items-center justify-start columns-8xs" 
    style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')",
        height: '100%',
    }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
        
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
          title="My Campers"
          description="View and manage your campers"
          navigateTo={`/group_leader_functions/my_campers/${user?.id}`}
          icon={<FaUsers className="text-8xl text-green-500"/>}
        />

        <Card 
          title="My Payment" 
          description="Check all payments you made and make payments"  
          navigateTo={`/group_leader_functions/manage_my_payment_group_leader/${user?.id}`}
          icon={<MdAssessment className="text-8xl text-red-500"/>}
        />
        <Card 
          title="Activities" 
          description="Register for activities" 
          navigateTo="/group_leader_activities"
          icon={<FaTasks className="text-8xl text-purple-500"/>}
        />
        <div className="card ">
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
        <PendingGroupsBlock pendingGroups={pendingGroups} />
        <UnpaidCampsBankSection unpaidCampsBank={unpaidCampsBank} user={user} />


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

function UnpaidCampsBankSection({ unpaidCampsBank, user }) {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Camps Awaiting Bank Transfer Confirmation</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-96">
        {unpaidCampsBank.length > 0 ? 
          unpaidCampsBank.map((registration) => (
            <div key={registration.camp_id} className="mb-4">
              <h3 className="text-xl font-semibold">Payment Create Date: {formatDateDisplay(registration.request_date)}</h3>
                <p className="text-gray-700">Payment amount: ${registration.amount}</p>
                <p className="text-gray-700">Payment Description: {registration.description}</p>
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Bank Transfer Information</h3>
                  <p><strong>Account Name:</strong> Kiwi Camp</p>
                  <p><strong>Account Number:</strong> 1000-1000-1000-1000</p>
                  <p><strong>Reference:</strong> {`${registration.id}-${registration.payment_id}`}</p>
                  <p className="text-sm text-gray-500 mt-2">Please email the proof of payment to kiwi_camp@gmail.com. Your group application will be processed once the payment is confirmed.</p>
              </div>
            </div>
          )) : 
          <p>No camps awaiting bank transfer confirmation.</p>
        }
      </div>
    </div>
  );
  }


function PendingGroupsBlock({ pendingGroups }) {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="card">
      <h2 className="text-3xl font-bold mb-6">Unpaid Payments</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-96">
        {pendingGroups.length > 0 ? (
          pendingGroups.map((group) => (
            <div key={group.group_id} className="mb-4">
              <h3 className="text-xl font-semibold">Payment Create Date: {formatDateDisplay(group.request_date)}</h3>
              <p className="text-gray-700">Payment amount: ${group.amount}</p>
              <p className="text-gray-700">Payment Description: {group.description}</p>
                      
            </div>
          ))
        ) : (
          <p>No pending payments.</p>
        )}
     
     <button
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                            onClick={() => navigate(`/group_leader_functions/manage_my_payment_group_leader/${id}`, { state: { id } })}
                          >
                            Manage Payment
                          </button>
      </div>
    </div>
  );
}

function formatDateDisplay(dateStr) {
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  }
  return "Invalid date";
}

export default Group_Leader_Dashboard;
