import React, { useEffect, useState, useCallback, memo } from 'react';
import axios from 'axios';
import Card from "../../components/card";
import '../../App.css';
import { useUser } from '../../contexts/UserContext';
import { FaUser, FaUsers } from 'react-icons/fa';
import { TbPigMoney } from "react-icons/tb";
import { FaCampground } from "react-icons/fa";
import {  } from "react-icons/fa";

import { useNavigate, useParams } from 'react-router-dom';

function YouthCamperDashboard() {
  const { user, logout } = useUser();
  const { id } = useParams();
  const user_id = id;
  const [news, setNews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [unpaidCampsBank, setUnpaidCampsBank] = useState([]);
  const [registeredCamps, setRegisteredCamps] = useState([]);

  const navigate = useNavigate();

  // Fetch news
  const fetchNews = useCallback(async () => {
    try {
      console.log(`Fetching news for user id: ${user_id}`);
      const response = await axios.get(`http://localhost:3000/youth_camper_dashboard/news/${user_id}`);
      console.log('News fetched:', response.data);
      setNews(prevNews => JSON.stringify(prevNews) !== JSON.stringify(response.data) ? response.data : prevNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }, [user_id]);

  // Fetch unpaid camps
  const fetchPayments = useCallback(async () => {
    try {
      console.log(`Fetching unpaid camps for user id: ${user_id}`);
      const response = await axios.get(`http://localhost:3000/campers/unpaid_camps/${user_id}`);
      console.log('Unpaid camps fetched:', response.data);
      setPayments(prevPayments => JSON.stringify(prevPayments) !== JSON.stringify(response.data) ? response.data : prevPayments);
    } catch (error) {
      console.error('Error fetching unpaid camps:', error);
    }
  }, [user_id]);

  // Fetch unpaid camps bank
  const fetchUnpaidCampsBank = useCallback(async () => {
    try {
      console.log(`Fetching unpaid camps bank for user id: ${user_id}`);
      const response = await axios.get(`http://localhost:3000/campers/unpaid_camps_bank/${user_id}`);
      console.log('Unpaid camps bank fetched:', response.data);
      setUnpaidCampsBank(prevCampsBank => JSON.stringify(prevCampsBank) !== JSON.stringify(response.data) ? response.data : prevCampsBank);
    } catch (error) {
      console.error('Error fetching unpaid camps bank:', error);
    }
  }, [user_id]);

  const fetchRegisteredCamps = useCallback(async () => {
    try {
      console.log(`Fetching registered camps for user id: ${user_id}`);
      const response = await axios.get(`http://localhost:3000/campers/registered_camps/${user_id}`);
      console.log('Registered camps fetched:', response.data);
      setRegisteredCamps(prevCamps => JSON.stringify(prevCamps) !== JSON.stringify(response.data) ? response.data : prevCamps);
    } catch (error) {
      console.error('Error fetching registered camps:', error);
    }
  }, [user_id]);

  useEffect(() => { 
    fetchNews();
    fetchPayments();
    fetchUnpaidCampsBank();
    fetchRegisteredCamps();
  }, [fetchNews, fetchPayments, fetchUnpaidCampsBank, fetchRegisteredCamps]);

  return (
   // mt-10 bg-cover p-8 min-h-screen flex flex-col items-center 
    <div className="main-content min-h-screen bg-cover bg-no-repeat p-6 flex flex-col items-center justify-start columns-8xs" 
    style={{
      backgroundImage: "url('/src/images/youth.avif')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100%'}}
      >
      <div className="container mx-auto py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card 
            title="My Profile"
            description="Edit and manage your profile"
            navigateTo={`/youth_profile/${user_id}`}
            icon={<FaUser className="text-8xl text-yellow-500" />}
            bgImage={'/src/images/card_bg2.jpeg'}
          />
          <Card 
            title="Join a Camp"
            description="Join a camp as a youth camper"
            navigateTo={`/youth_camper_functions/register_camps/${user_id}`}
            icon={<FaUsers className="text-8xl text-orange-500" />}
            bgImage={'/src/images/bg.jpeg'}
         />
          <Card 
            title="My payment"
            description="Manage your payment for camps and activities"
            navigateTo={`/youth_camper_functions/manage_my_payment_youth/${user_id}`}
            icon={<TbPigMoney className="text-8xl text-violet-500" />}
            bgImage={'/src/images/card_bg2.jpeg'}
          />

          <Card
            title="My Camps"
            description= "Camps，teams，accommodations and book activities"
            navigateTo={`/camper_functions/camps/${user_id}`}
            icon={<FaCampground className="text-8xl text-green-600" />}
            bgImage={'/src/images/camp_bg.jpeg'}
          />

          <MemoizedRegisteredCampsSection registeredCamps={registeredCamps} />
          <MemoizedNewsSection news={news} />
          <MemoizedPaymentsSection payments={payments} navigate={navigate} user={user} user_id={user_id} />
          <MemoizedUnpaidCampsBankSection unpaidCampsBank={unpaidCampsBank} user={user} />
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

const NewsSection = memo(({ news }) => {
  return (
    <div className="card bg-white p-6 rounded-lg shadow-lg">
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
});

const PaymentsSection = memo(({ payments, navigate, user, user_id }) => {
  console.log(user_id)
  return (
    <div className="card bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Unpaid Payments</h2>
      <div className="overflow-y-auto max-h-80">
        {payments.length > 0 ? 
          payments.map((payment) => (
            <div key={payment.request_date} className="mb-4">
              <h3 className="text-xl font-semibold">Payment Create Date: {formatDateDisplay(payment.request_date)}</h3>
              <p className="text-gray-700">Payment amount: ${payment.amount}</p>
              <p className="text-gray-700">Payment Description: {payment.description}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                onClick={() => navigate(`/youth_camper_functions/manage_my_payment_youth/${user_id}`, { state: { user_id } })}
              >
                Manage Payment
              </button>
            </div>
          )) : 
          <p>No unpaid payments.</p>
        }
      </div>
    </div>
  );
});

const UnpaidCampsBankSection = memo(({ unpaidCampsBank, user }) => {
  return (
    <div className="card bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Camps Awaiting Bank Transfer Confirmation</h2>
      <div className="overflow-y-auto max-h-80">
        {unpaidCampsBank.length > 0 ?
          unpaidCampsBank.map((registration) => (
            <div key={registration.request_date} className="mb-4">
              <h3 className="text-xl font-semibold">Payment Create Date: {formatDateDisplay(registration.request_date)}</h3>
              <p className="text-gray-700">Payment amount: ${registration.amount}</p>
              <p className="text-gray-700">Payment Description: {registration.description}</p>
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Bank Transfer Information</h3>
                <p><strong>Account Name:</strong> Kiwi Camp</p>
                <p><strong>Account Number:</strong> 1000-1000-1000-1000</p>
                <p><strong>Reference:</strong> {`${registration.user_id}-${registration.payment_id}`}</p>
                <p className="text-sm text-gray-500 mt-2">Please email the proof of payment to kiwi_camp@gmail.com. Your group application will be processed once the payment is confirmed.</p>
              </div>
            </div>
          )) : 
          <p>No camps awaiting bank transfer confirmation.</p>
        }
      </div>
    </div>
  );
});

const RegisteredCampsSection = memo(({ registeredCamps }) => {
  return (
    <div className="card bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Registered Camps</h2>
      <div className="overflow-y-auto max-h-80">
        {registeredCamps.length > 0 ? 
          registeredCamps.map((camp) => (
            <div key={camp.request_date} className="mb-4">
              <h3 className="text-xl font-semibold">Camp: {camp.camp_name}</h3>
              <p className="text-gray-700">Camp Start Date: {formatDateDisplay(camp.start_date)}</p>
              <p className="text-gray-700">Camp End Date: {formatDateDisplay(camp.end_date)}</p>
              <p className="text-gray-700">Camp Schedule: {camp.schedule}</p>
              <p className="text-gray-700">Group Name: {camp.group_name}</p>   
              <p className="text-gray-700">Group Description: {camp.group_description}</p>     
            </div>
          )) : 
          <p>No registered camps.</p>
        }
      </div>
    </div>
  );
});

const MemoizedNewsSection = memo(NewsSection);
const MemoizedPaymentsSection = memo(PaymentsSection);
const MemoizedUnpaidCampsBankSection = memo(UnpaidCampsBankSection);
const MemoizedRegisteredCampsSection = memo(RegisteredCampsSection);

export default YouthCamperDashboard;

function formatDateDisplay(dateStr) {
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  }
  return "Invalid date";
}
