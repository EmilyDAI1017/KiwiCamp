import { useState } from "react";
import axios from 'axios';

export default function Youth() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role:"Youth",
        first_name: '',
        last_name: '',
        email: '',
        phone_num:'',
        gender: '',
        dob:'',
        parent_guardian_name:'',
        parent_guardian_phone:'',
        parent_guardian_email:'',
        activitiy_preferences:'',
        medical_condition:'',
        allegies_information:''
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        // Send formData to backend API for registration
        console.log(formData);
    };
    
    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
            alert("Please enter the camper's first name")
            return
        }
        if(!formData.last_name) {
            alert("Please enter the camper's last name")
            return
        }
        if(!formData.email) {
            alert('Please enter email')
            return
        }
        if(!formData.phone_num) {
            alert('Please enter contact number')
            return
        }
        if(!formData.gender) {
            alert("Please select the camper's gender")
            return
        }
        if(!formData.dob) {
            alert("Please enter the camper's date of birth")
            return
        }
        if(!formData.parent_guardian_name) {
            alert("Please enter the parent/guardian's name")
            return
        }
        if(!formData.parent_guardian_phone) {
            alert("Please enter the parent/guardian's phone number")
            return
        }
        if(!formData.parent_guardian_email) {
            alert("Please enter the parent/guardian's email")
            return
        }
        

        console.log(formData)
        axios.post('http://localhost:3000/register', formData).then(({data}) => {
            console.log(data)
            if(data.status){
                alert('Registration successful')
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
                        placeholder="Enter Camper's Date of Birth"
                        required></input>
                </div>

                <div className="form_unit">
                    <label>Parent/Guardian Name:</label>
                    <input
                        type="text"
                        name="parent_guardian_name"
                        value={formData.parent_guardian_name}
                        onChange={handleFormChange}
                        placeholder="Enter Parent/Guardian Name"
                        required></input>
                </div>
                <div className="form_unit">
                    <label>Parent/Guardian Phone Number:</label>
                    <input
                        type="text"
                        name="parent_guardian_phone"
                        value={formData.parent_guardian_phone}
                        onChange={handleFormChange}
                        placeholder="Enter Parent/Guardian Phone Number"
                        required></input>
                </div>
                <div className="form_unit">
                    <label>Parent/Guardian Email:</label>
                    <input
                        type="email"
                        name="parent_guardian_email"
                        value={formData.parent_guardian_email}
                        onChange={handleFormChange}
                        placeholder="Enter Parent/Guardian's Email"
                        required></input>
                </div>
                <div className="form_unit">
                    <label>Activtity Preferences:</label>
                    <input
                        type="text"
                        name="activitiy_preferences"
                        value={formData.emergency_contact_name}
                        onChange={handleFormChange}
                        placeholder="Camper's activity preferences?">
                    </input>

                </div>

                <div className="form_unit">
                    <label>Medical Condition:</label>
                    <input
                        type="text"
                        name="medical_condition"
                        value={formData.medical_condition}
                        onChange={handleFormChange}
                        placeholder="Camper's medical condition?(If any)">
                    </input>
                </div>
                <div className="form_unit">
                    <label>Allegy information:</label>
                    <input
                        type="text"
                        name="allegies_information"
                        value={formData.emergency_contact_name}
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
