import { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
        <div class="main-content mt-11 bg-cover dark:bg-neutral-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
        <div className="min-h-screen flex items-center justify-center" >
            <div className="max-w-md w-full bg-white/70 shadow-lg rounded-lg p-8" >
                <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Welcome to Kiwi Camp</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <label              
                 class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                >               
                Username:</label>
                <input type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleFormChange} 
                placeholder="Enter your username" 
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required 
                />
                <label 
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                Password:</label>
                <input 
                type={pwdHidden} 
                value={formData.password} 
                onChange={handleFormChange} 
                name="password" 
                placeholder="Enter password" 
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"                
                required />
               
                {/* <Button 
                onClick={togglePwdShow} 
                className=" bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
            Show Password</Button> */}


<p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Don’t have an account yet? 
          <Link to="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Sign up</Link>
        </p>
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</Button>
                <br />
               
               <Link to="/reset_password" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Forgot password?</Link>


                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            </form>   
        </div>
        </div>
        </div>
    );
}
