import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { Button } from "@material-tailwind/react";
import { useUser } from '../contexts/UserContext';

export default function Login(){
    const { login } = useUser();
    const [pwdHidden, setPwdHidden] = useState('password');
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigateTo = useNavigate();

    const togglePwdShow = (e) => {
        e.preventDefault();
        setPwdHidden(pwdHidden === 'text' ? 'password' : 'text');
    };
    const dashboard_path = {
        'Youth': 'youth_camper_dashboard',
        'Adult Leader': 'adult_leader_dashboard',
        'Group Leader': 'group_leader_dashboard',
        'Admin': 'admin_dashboard',
        'Staff': 'staff_dashboard',
        'Manager': 'manager_dashboard'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:3000/login', formData);
            if (data.user_id && data.role) {
                login({ id: data.user_id, role: data.role });
                console.log("found:",data.role);
                navigateTo(`/${dashboard_path[data.role]}/${data.user_id}`);
            } else {
                setError('Login failed. Please check your username and password and try again.');
            }
        } catch (error) {
            console.error('Login error response:', error.response);
            setError('Login failed: ' + (error.response?.data?.message || 'Please check your credentials.'));
        }
    };

    const handleFormChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    return (
        <div class="main-content">
            <h1>Welcome to Kiwi Camp</h1>
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleFormChange} placeholder="Enter your username" required />
                <label>Password:</label>
                <input type={pwdHidden} value={formData.password} onChange={handleFormChange} name="password" placeholder="Enter password" required />
                <Button onClick={togglePwdShow}>Show Password</Button>
                <Button type="submit">Login</Button>
                {error && <p className="error-message">{error}</p>}
            </form>   
        </div>
    );
}
