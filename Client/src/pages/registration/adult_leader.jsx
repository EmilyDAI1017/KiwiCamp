import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Adult_Leader() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role:"Adult Leader",
        first_name: '',
        last_name: '',
        email: '',
        phone_num:'',
        gender: '',
        dob:'',
        emergency_contacts_name:'',
        emergency_contacts_phone:'',
        medical_condition:'',
        allergies_information:'',
        dietary_requirement:'',
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        // Send formData to backend API for registration
        console.log(formData);
    };
    
    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const navigateTo = useNavigate();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if(!formData.username) {
            alert('Please enter the username')
            return
        }
        if(!formData.password) {
            alert('Please enter password')
            return
        }
        if(formData.password !== formData.confirmPassword) {
            alert('Passwords do not match')
            return
        }
        if(!formData.first_name) {
            alert("Please enter your first name")
            return
        }
        if(!formData.last_name) {
            alert("Please enter your last name")
            return
        }
        if(!formData.email) {
            alert('Please enter your email')
            return
        }
        if(!formData.phone_num) {
            alert('Please enter contact number')
            return
        }
        if(!formData.gender) {
            alert("Please select your gender")
            return
        }
        if(!formData.dob) {
            alert("Please enter your date of birth")
            return
        }
        // Validate phone number format
        const phoneRegex = /^[0-9]{10}$/; // assuming 10-digit phone number
        if (!phoneRegex.test(formData.phone_num)) {
            alert('Please enter a valid phone number');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Validate birthday not beyond today's date
        const today = new Date();
        const dob = new Date(formData.dob);
        if (dob > today) {
            alert('Please enter a valid date of birth');
            return;
        }
        

        console.log(formData)
        axios.post('http://localhost:3000/register/adult_leader', formData)
            .then(response => {
                alert('Registration successful, please login');
                navigateTo('/login');
            }
            )
            .catch(error => {
            if (error.response.status === 409)
            alert('Username already exists, please choose another username');
            });
    };

return(
    <div className="main-content bg-gray-100/90 flex flex-col items-center justify-center min-h-screen py-12"
        style={{
        backgroundImage: "url('/src/images/camp_bg2.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100%'
      }}>
           <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-max">
          
    <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Register for Kiwi Camp</h1>

    <form className="space-y-4 " onSubmit={handleSubmit}> 
        <div className="mx-10 p-7">
            <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>

            <div className="form_unit">
                <label className="block text-gray-700">Username:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                    placeholder="Enter your username"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                />
            </div>
            <div className="form_unit">
                <label className="block text-gray-700">Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    placeholder="Enter password"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                />
            </div>
            <div className="form_unit">
                <label className="block text-gray-700">Confirm Password:</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleFormChange}
                    placeholder="Confirm password"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                />
            </div>
            <div className="form_unit">
                <label className="block text-gray-700">First Name:</label>
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleFormChange}
                    placeholder="Enter your first name"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                />
            </div>
            <div className="form_unit">
                <label className="block text-gray-700">Last Name:</label>
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleFormChange}
                    placeholder="Enter your last name"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                />
            </div>

            <div className="form_unit">
                <label className="block text-gray-700">Date of Birth:</label>
                <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    max="{{ today }}"
                    onChange={handleFormChange}
                    placeholder="Enter your Date of Birth"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                />
            </div>

            <div className="form_unit">
                <label className="block text-gray-700">Gender:</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            </div>
        
            

            <div className="mx-20 w-80 p-3">
            <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
            
                            <div className="form_unit">
                                <label className="block text-gray-700">Email:</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                                />
                            </div>
                            <div className="form_unit">
                                <label className="block text-gray-700">Phone Number:</label>
                                <input
                                    type="text"
                                    name="phone_num"
                                    value={formData.phone_num}
                                    onChange={handleFormChange}
                                    placeholder="Enter your phone number"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                                />
                            </div>
           
                                <h2 className="text-lg font-semibold text-gray-800">Emergency Contact</h2>

                                <div className="form_unit">
                                    <label className="block text-gray-700">Emergency Contact Name:</label>
                                    <input
                                        type="text"
                                        name="emergency_contacts_name"
                                        value={formData.emergency_contacts_name}
                                        onChange={handleFormChange}
                                        placeholder="Enter your Emergency Contact Name"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                                    />
                                </div>
                                <div className="form_unit">
                                    <label className="block text-gray-700">Emergency Contact Phone Number:</label>
                                    <input
                                        type="text"
                                        name="emergency_contacts_phone"
                                        value={formData.emergency_contacts_phone}
                                        onChange={handleFormChange}
                                        placeholder="Enter your Emergency Contact Phone Number"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                                    />
                                </div>
                           
           
            
            <h2 className="text-lg font-semibold text-gray-800">Health Information</h2>

            <div className="form_unit">
                            <label className="block text-gray-700">Medical Condition:</label>
                            <input
                                type="text"
                                name="medical_condition"
                                value={formData.medical_condition}
                                onChange={handleFormChange}
                                placeholder="Medical condition? (If any)"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            />
                        </div>
                        <div className="form_unit">
                            <label className="block text-gray-700">Allergy information:</label>
                            <input
                                type="text"
                                name="allergies_information"
                                value={formData.allergies_information}
                                onChange={handleFormChange}
                                placeholder="Any allergy information?"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            />
                        </div>
                        <div className="form_unit">
                            <label className="block text-gray-700">Dietary requirement:</label>
                            <input
                                type="text"
                                name="dietary_requirement"
                                value={formData.dietary_requirement}
                                onChange={handleFormChange}
                                placeholder="Any dietary requirement?"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            />
                        </div>
              
               
       
                        </div>
            <div className="mx-20 w-80 p-3">
            <button onClick={handleFormSubmit} type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-indigo-200"
>Register</button>
     
            </div>
        </form>
  

        </div>
    </div>


);
};