import React, { useEffect, useState } from 'react';
import Card from "../../components/card";
import '../../App.css';
import { useUser } from '../../contexts/UserContext';
import { FaUser, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function YouthCamperDashboard() {
  const { user, logout } = useUser();
  const [news, setNews] = useState([]);
  const [unpaidCamps, setUnpaidCamps] = useState([]);
  const [unpaidCampsBank, setUnpaidCampsBank] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/youth_camper_dashboard/news/${user.id}`)
      .then(response => response.json())
      .then(data => setNews(data))
      .catch(error => console.error('Error fetching news:', error));
  }, [user.id]);

  useEffect(() => {
    fetch(`http://localhost:3000/campers/unpaid_camps/${user.id}`)
      .then(response => response.json())
      .then(data => setUnpaidCamps(data))
      .catch(error => console.error('Error fetching unpaid camps:', error));
  }, [user.id]);

  useEffect(() => {
    fetch(`http://localhost:3000/campers/unpaid_camps_bank/${user.id}`)
      .then(response => response.json())
      .then(data => setUnpaidCampsBank(data))
      .catch(error => console.error('Error fetching unpaid camps:', error));
  }, [user.id]);

  return (
    <div className="main_content">
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600">Youth Camper Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.name}!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card 
            title="My Profile"
            description="Edit and manage your profile"
            navigateTo={`/youth_profile/${user.id}`}
            icon={<FaUser className="text-4xl text-blue-500" />}
          />
          <Card 
            title="Join a Camp"
            description="Join a camp as a youth camper"
            navigateTo={`/youth_camper_functions/register_camps/${user.id}`}
            icon={<FaUsers className="text-4xl text-green-500" />}
          />
          <NewsSection news={news} />
          <UnpaidCampsSection unpaidCamps={unpaidCamps} navigate={navigate} user={user} />
          <UnpaidCampsBankSection unpaidCampsBank={unpaidCampsBank} user={user} />
        </div>
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

function NewsSection({ news }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Latest News</h2>
      <div className="overflow-y-auto max-h-80">
        {news.length > 0 ? 
          news.map((item) => (
            <div key={item.news_id} className="mb-4">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-700">{item.content}</p>
              <p className="text-sm text-gray-500">{formatDateDisplay(item.publish_date)}</p>
            </div>
          )) : 
          <p>No news available.</p>
        }
      </div>
    </div>
  );
}

function UnpaidCampsSection({ unpaidCamps, navigate, user }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Unpaid Camps</h2>
      <div className="overflow-y-auto max-h-80">
        {unpaidCamps.length > 0 ? 
          unpaidCamps.map((camp) => (
            <div key={camp.camp_id} className="mb-4">
              <h3 className="text-xl font-semibold">Camp: {camp.camp_name}</h3>
              <p className="text-gray-700">Amount: ${camp.amount}</p>
              <p className="text-gray-700">Registered Date: {formatDateDisplay(camp.request_date)}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                onClick={() => navigate('/youth_camper_functions/campers_card_payment', { state: { camp_name: camp.camp_name, finalPrice: camp.amount, user_id: user.id } })}              >
                Manage Payment
              </button>
            </div>
          )) : 
          <p>No unpaid camps.</p>
        }
      </div>
    </div>
  );
}

function UnpaidCampsBankSection({ unpaidCampsBank, user }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Camps Awaiting Bank Transfer Confirmation</h2>
      <div className="overflow-y-auto max-h-80">
        {unpaidCampsBank.length > 0 ? 
          unpaidCampsBank.map((registration) => (
            <div key={registration.camp_id} className="mb-4">
              <h3 className="text-xl font-semibold">Camp: {registration.camp_name}</h3>
              <p className="text-gray-700">Amount: ${registration.amount}</p>
              <p className="text-gray-700">Registered Date: {formatDateDisplay(registration.request_date)}</p>
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Bank Transfer Information</h3>
                <p><strong>Account Name:</strong> Kiwi Camp</p>
                <p><strong>Account Number:</strong> 1000-1000-1000-1000</p>
                <p><strong>Reference:</strong> {`${registration.group_name}-${registration.camp_name}-${user.id}`}</p>
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

function formatDateDisplay(dateStr) {
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  }
  return "Invalid date";
}

export default YouthCamperDashboard;
