// import { useState } from "react"
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../App.css'
// import { Button } from "@material-tailwind/react";
// import { useUser } from '../contexts/UserContext';

// export default function Login({ setIsLoggedIn }){
//     const { login } = useUser();
//     const [pwdHidden, setPwdHidden] =  useState('password')

//     const [ formData, setFormData ] = useState({ 
//         username: '',
//         password: '',
//     });
//     const navigateTo = useNavigate();


//     const togglePwdShow = (e) => {
//         e.preventDefault()
//         pwdHidden === 'text' ? setPwdHidden('password') :
//         setPwdHidden('text')
//     };
    
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         axios.post('http://localhost:3000/login', formData)
//             .then(({ data }) => {
//                 console.log(data.role);
//                 if (data) {
//                     login(data.user_id);                      // Redirect to the corresponding user's dashboard with user ID
//                     // /${data.user_id}
//                     if (data.role === 'Youth') {
//                         navigateTo(`/youth_camper_dashboard/${data.user_id}`);
//                     } else if (data.role === 'Adult Leader') {
//                         navigateTo(`/adult_leader_dashboard/${data.user_id}`);
//                     } else if (data.role === 'Group Leader') {
//                         navigateTo(`/group_leader_dashboard/${data.user_id}`);
//                     } else if (data.role === 'Admin') {
//                         navigateTo(`/admin_dashboard/${data.user_id}`);
//                     } else if (data.role === 'Staff') {
//                         navigateTo(`/staff_dashboard/${data.user_id}`);
//                     } else if (data.role === 'Manager') {
//                         navigateTo(`/manager_dashboard/${data.user_id}`);
//                     }
//                 }
//                 else {
//                     console.error('User ID not provided in response.');
//                 }
//             })
//             .catch(error => {
//                 console.error('Login failed:', error);
//                 alert('Please enter the rigth username and password.')
//             });
//     };

//     const handleFormChange = (e) => {
//         setFormData({...formData, [e.target.name]: e.target.value})
//     };


//     return (
//         <div>
//             <h1>Welcome to Kiwi Camp</h1>
//             <form>
//                 <label class = "">Username:</label>
//                 <input type="text" name="username" value={formData.username} onChange={handleFormChange} placeholder="Enter your username"  className="input-field" required></input>    
//                 <label>Password:</label>
//                 <input type={pwdHidden} value={formData.password} onChange={handleFormChange} name="password" placeholder="Enter password"  className="border-black border-2 rounded-2xl py-2 px-4 "></input>
//                 <Button onClick={togglePwdShow} className ="btn-primary" >Show Password</Button>
//                 <Button onClick={handleSubmit}  type="submit">Login</Button>
//             </form>   
//         </div>
//     )
// }

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
                navigateTo(`/${dashboard_path[data.role]}/${data.user_id}`);
            } else {
                setError('Login failed. Please check your username and password and try again.');
            }
        } catch (error) {
            setError('Network error. Please try again later.');
            console.error('Login failed:', error);
        }
    };

    const handleFormChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    return (
        <div>
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
