import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { FaChildReaching } from "react-icons/fa6";
import { FaPeopleRobbery } from "react-icons/fa6";
import { MdEmojiPeople } from "react-icons/md";


export default function Register() {
    const [selectedRole, setSelectedRole] = useState("");
    const navigate = useNavigate(); // Renamed to navigate

    const handleRoleSelection = (role) => {
        setSelectedRole(role);
        // Redirect to the corresponding registration page based on role
        navigate( `/register/${role.toLowerCase().replace(' ', '_')}`); // Correct usage of navigate 
        // `../pages/registration/${role.toLowerCase().replace(' ', '_')}`
    };

    return ( 
        <div className="main-content mt-12 bg-contain p-8 min-h-screen flex flex-col items-center justify-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FtcHxlbnwwfHwwfHx8MA%3D%3D')" }} >

   <div className="max-w-3xl w-full bg-white/70 shadow-lg rounded-lg p-8 space-y-6">        
            <h1  className="text-3xl font-bold text-center text-gray-800">Register for Kiwi Camp</h1>
            <p className="text-center text-gray-600">I want to sign up as a:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            <div
            className={`card p-13 m-4 rounded-lg shadow-lg cursor-pointer hover:scale-80 transition-transform duration-300 ease-in-out overflow-hidden max-w-xs`}
            onClick={() => handleRoleSelection("Youth Camper")}>
                <div className="card-icon mb-0 flex justify-center">
                <FaChildReaching className="text-8xl text-orange-500"/>
                </div>
        <p className="text-lg text-gray-700">Please make sure the youth campers can only be registered by their guardians</p>
      <h2 className="text-3xl font-bold text-gray-800">Youth Camper</h2>
      

             </div>
             
             <div
            className={`card p-13 m-4 rounded-lg shadow-lg cursor-pointer hover:scale-80 transition-transform duration-300 ease-in-out overflow-hidden max-w-xs`}
            onClick={() => handleRoleSelection("Adult Leader")}>
                <div className="card-icon mb-4 flex justify-center">
                <FaPeopleRobbery className="text-8xl text-blue-500"/>
                </div>
        
      <h1 className="text-3xl font-bold text-gray-800">Adult Leader</h1>

             </div>

             <div
            className={`card p-13 m-4 rounded-lg shadow-lg cursor-pointer hover:scale-80 transition-transform duration-300 ease-in-out overflow-hidden max-w-xs`}
            onClick={() => handleRoleSelection("Group Leader")}>
                <div className="card-icon flex justify-center">
                <MdEmojiPeople className="text-8xl text-green-500"/>
                </div>
        
            <h2 className="text-3xl font-bold text-gray-800">Group Leader</h2>

             </div>
            {/* <button onClick={() => handleRoleSelection("Youth Camper")} className="w-full bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out">Youth Camper</button>
            <button onClick={() => handleRoleSelection("Adult Leader")} className="w-full bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out">Adult Leader</button>
            <button onClick={() => handleRoleSelection("Group Leader")} className="w-full bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out">Group Leader</button> */}
           </div>
      
            </div>
    </div>
    );
}