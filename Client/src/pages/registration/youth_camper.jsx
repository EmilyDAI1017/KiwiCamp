import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

export default function Youth() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: "Youth",
        first_name: '',
        last_name: '',
        email: '',
        phone_num: '',
        gender: '',
        dob: '',
        parent_guardian_name: '',
        parent_guardian_phone: '',
        parent_guardian_email: '',
        relationship_to_camper: '',
        activity_preferences: '',
        medical_condition: '',
        allergies_information: '',
        dietary_requirement: '',
    });

    const navigateTo = useNavigate();

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value.trim() === '' ? null : value
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Add validation checks here...

        axios.post('http://localhost:3000/register/youth_camper', formData)
            .then(response => {
                alert('Registration successful, please login');
                navigateTo('/login');
            })
            .catch(error => {
                if (error.response.status === 409) {
                    alert('Username already exists, please choose another username');
                }
            });
    };

    return (
        <div className="main-content bg-gray-100/90 flex flex-col items-center justify-center min-h-screen py-12"
        style={{
            backgroundImage: "url('/src/images/camp_bg2.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100%'
          }}>           
           <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Register for Kiwi Camp</h1>
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleFormChange}
                            placeholder="Enter your username"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleFormChange}
                            placeholder="Enter password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleFormChange}
                            placeholder="Confirm password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">First Name:</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleFormChange}
                            placeholder="Enter your first name"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Last Name:</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleFormChange}
                            placeholder="Enter your last name"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Email:</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Phone Number:</label>
                        <input
                            type="text"
                            name="phone_num"
                            value={formData.phone_num}
                            onChange={handleFormChange}
                            placeholder="Enter your phone number"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Gender:</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Date of Birth:</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Parent/Guardian Name:</label>
                        <input
                            type="text"
                            name="parent_guardian_name"
                            value={formData.parent_guardian_name}
                            onChange={handleFormChange}
                            placeholder="Enter Parent/Guardian Name"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Parent/Guardian Phone Number:</label>
                        <input
                            type="text"
                            name="parent_guardian_phone"
                            value={formData.parent_guardian_phone}
                            onChange={handleFormChange}
                            placeholder="Enter Parent/Guardian Phone Number"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Parent/Guardian Email:</label>
                        <input
                            type="email"
                            name="parent_guardian_email"
                            value={formData.parent_guardian_email}
                            onChange={handleFormChange}
                            placeholder="Enter Parent/Guardian's Email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Relationship to the camper:</label>
                        <input
                            type="text"
                            name="relationship_to_camper"
                            value={formData.relationship_to_camper}
                            onChange={handleFormChange}
                            placeholder="Relationship to the camper?"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Activity Preferences:</label>
                        <input
                            type="text"
                            name="activity_preferences"
                            value={formData.activity_preferences}
                            onChange={handleFormChange}
                            placeholder="Camper's activity preferences?"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                    </div>
                    <p className="text-xl font-bold text-gray-700 mt-6">Health information:</p>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Medical Condition:</label>
                        <input
                            type="text"
                            name="medical_condition"
                            value={formData.medical_condition}
                            onChange={handleFormChange}
                            placeholder="Camper's medical condition? (If any)"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Allergy information:</label>
                        <input
                            type="text"
                            name="allergies_information"
                            value={formData.allergies_information}
                            onChange={handleFormChange}
                            placeholder="Any allergy information?"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                    </div>
                    <div className="form_unit">
                        <label className="block text-gray-700 font-bold">Dietary requirement:</label>
                        <input
                            type="text"
                            name="dietary_requirement"
                            value={formData.dietary_requirement}
                            onChange={handleFormChange}
                            placeholder="Any dietary requirement?"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 mt-6 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
