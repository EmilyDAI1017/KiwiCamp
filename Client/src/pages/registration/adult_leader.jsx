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
        allergies_information:''
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
        axios.post('http://localhost:3000/register/adult_leader', formData).then(({data}) => {
            console.log(data)
            if(data.status){
                alert('Registration successful, please login')
                navigateTo('/login');
            } else {
                alert('Registration failed')
            } 
        })
    }


    return (
        <div>
            <h1>Register for Kiwi Camp</h1>
            <div className="form_wrapper">
            <form className="form_content" onSubmit={handleSubmit}>
                <div className="form_unit">
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                    placeholder="Enter your username"
                    required
                />
                </div>
                <div className="form_unit">

                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    placeholder="Enter password"
                    required
                />
                </div>
                <div className="form_unit">

                <label>Confirm Password:</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleFormChange}
                    placeholder="Confirm password"
                    required
                />
                </div>
                <div className="form_unit">

                <label>First Name:</label>
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleFormChange}
                    placeholder="Enter your first name"
                    required
                />
                </div>
                <div className="form_unit">

                <label>Last Name:</label>
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleFormChange}
                    placeholder="Enter your last name"
                    required
                />
                </div>
                <div className="form_unit">

                <label>Email:</label>
                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Enter your email"
                    required
                />
                </div>
                <div className="form_unit">

                <label>Phone Number:</label>
                <input
                    type="text"
                    name="phone_num"
                    value={formData.phone_num}
                    onChange={handleFormChange}
                    placeholder="Enter your phone number"
                    required
                />
                </div>
                <div className="form_unit">
                <label>Gender:</label>
                <select className="form_unit"
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                </div>
                <div className="form_unit"> 
                <label>Date of Birth:</label>
                <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        max="{{ today }}"
                        onChange={handleFormChange}
                        placeholder="Enter your Date of Birth"
                        required></input>
                </div>

                <div className="form_unit">
                    <label>Emergency Contact Name:</label>
                    <input
                        type="text"
                        name="emergency_contacts_name"
                        value={formData.emergency_contacts_name}
                        onChange={handleFormChange}
                        placeholder="Enter your Emergency Contact Name"
                        required></input>
                </div>
                <div className="form_unit">
                    <label>Emergency Contact Phone Number:</label>
                    <input
                        type="text"
                        name="emergency_contacts_phone"
                        value={formData.emergency_contacts_phone}
                        onChange={handleFormChange}
                        placeholder="Enter your Emergency Contact Phone Number"
                        required></input>
                </div>

                <div className="form_unit">
                    <label>Medical Condition:</label>
                    <input
                        type="text"
                        name="medical_condition"
                        value={formData.medical_condition}
                        onChange={handleFormChange}
                        placeholder="Medical condition?(If any)">
                    </input>
                </div>
                <div className="form_unit">
                    <label>Allergy information:</label>
                    <input
                        type="text"
                        name="allergies_information"
                        value={formData.allergies_information}
                        onChange={handleFormChange}
                        placeholder="Any allegy informagtion?">

                        </input>
                </div>


                <button onClick={handleFormSubmit} type="submit">Register</button>
            </form>
            </div>
        </div>
    );
}
