import React, { useEffect, useState } from 'react';
import Card from "../../components/card";
import '../../App.css';
import { useUser } from '../../contexts/UserContext';
import { useNavigate, useParams } from 'react-router-dom'; 
import { FaUser, FaUsers, FaCampground, FaTasks, FaNewspaper, FaMapMarkedAlt } from 'react-icons/fa';
import { TbPigMoney } from "react-icons/tb";

function Adult_Leader_Dashboard() {
  const { user } = useUser();
  const { id } = useParams();
  console.log(id);
  const [news, setNews] = useState([]);
  const [unpaidCamps, setUnpaidCamps] = useState([]);
  const [unpaidCampsBank, setUnpaidCampsBank] = useState([]);
  const [registeredCamps, setRegisteredCamps] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/adult_leader_dashboard/news/${id}`)
      .then(response => response.json())
      .then(data => setNews(data))
      .catch(error => console.error('Error fetching news:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3000/campers/unpaid_camps/${id}`)
      .then(response => response.json())
      .then(data => setUnpaidCamps(data))
      .catch(error => console.error('Error fetching unpaid camps:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3000/campers/unpaid_camps_bank/${id}`)
      .then(response => response.json())
      .then(data => setUnpaidCampsBank(data))
      .catch(error => console.error('Error fetching unpaid camps:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3000/campers/registered_camps/${id}`)
      .then(response => response.json())
      .then(data => setRegisteredCamps(data))
      .catch(error => console.error('Error fetching registered camps:', error));
  }
  , [id]);

  return (
    <div className="main-content h-screen bg-cover bg-no-repeat p-6 flex flex-col items-center justify-start columns-8xs" 
    style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')", 
          height: '100%',
          }}>
    <div className="container mx-auto py-8">

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card 
          title="My Profile"
          description="Edit and manage your profile"
          navigateTo={`/adult_leader_profile/${id}`}
          icon={<FaUser className="text-8xl text-blue-500" />}
        />
        <Card 
          title="Join a Camp"
          description="Join a camp as a youth camper"
          navigateTo={`/adult_leader_functions/register_camps_al/${id}`}
          icon={<FaUsers className="text-8xl text-orange-500" />}
        />

          <Card 
            title="My payment"
            description="Manage your payment for camps and activities"
            navigateTo={`/adult_leader_functions/manage_my_payment_adult/${id}`}
            icon={<TbPigMoney className="text-8xl text-pink-500" />}
          />

          <Card
            title="My Camps"
            description= "Camps，teams，accommodations and book activities"
            navigateTo={`/adult_leader_functions/camp_functions_al/${id}`}
            icon={<FaCampground className="text-8xl text-green-600" />}
          />
          
        <RegisteredCampsSection registeredCamps={registeredCamps} />  
        <NewsSection news={news} />
        <UnpaidCampsSection unpaidCamps={unpaidCamps} navigate={navigate} user={user} user_id={id} />
        <UnpaidCampsBankSection unpaidCampsBank={unpaidCampsBank} user={user} />
      </div>
    </div>
  </div>
);



function NewsSection({ news }) {
return (
  <div className="card bg-green p-6 rounded-lg shadow-lg"
  style={{
    backgroundImage: "url(’/src/images/rainbow.jpg’)"
  }}
  >
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

function UnpaidCampsSection({ unpaidCamps, navigate, user, user_id }) {
return (
  <div className="card bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-4">Unpaid Payments</h2>
    <div className="overflow-y-auto max-h-80">
      {unpaidCamps.length > 0 ? 
        unpaidCamps.map((payment) => (
          <div key={payment.request_date} className="mb-4">
            <h3 className="text-xl font-semibold">Payment Create Date: {formatDateDisplay(payment.request_date)}</h3>
            <p className="text-gray-700">Payment amount: ${payment.amount}</p>
            <p className="text-gray-700">Payment Description: {payment.description}</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
              onClick={() => navigate(`/adult_leader_functions/manage_my_payment_adult/${user_id}`, { state: { id: id } })}
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
}

function UnpaidCampsBankSection({ unpaidCampsBank, user }) {
return (
  <div className="card bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-4">Camps Awaiting Bank Transfer Confirmation</h2>
    <div className="overflow-y-auto max-h-80">
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

function RegisteredCampsSection({ registeredCamps }) {
return (
  <div className="card bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-4">Registered Camps</h2>
    <div className="overflow-y-auto max-h-80">
      {registeredCamps.length > 0 ? 
        registeredCamps.map((camp) => (
          <div key={camp.camp_id} className="mb-4">
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
}



  function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
    return "Invalid date";
  }

}

export default Adult_Leader_Dashboard;
