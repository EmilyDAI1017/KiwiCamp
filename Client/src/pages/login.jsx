import { useState } from "react"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Login(){

    const [pwdHidden, setPwdHidden] =  useState('password')

    const [ formData, setFormData ] = useState({
        username: '',
        password: '',
    });
    const navigateTo = useNavigate();


    const togglePwdShow = (e) => {
        e.preventDefault()
        pwdHidden === 'text' ? setPwdHidden('password') :
        setPwdHidden('text')
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/login', formData)
            .then(({ data }) => {
                console.log(data.role);
                if (data) {
                    // Redirect to the corresponding user's dashboard with user ID
                    // /${data.user_id}
                    if (data.role === 'Youth') {
                        navigateTo(`/youth_camper_dashboard/${data.user_id}`);
                    } else if (data.role === 'Adult Leader') {
                        navigateTo(`/adult_leader_dashboard/${data.user_id}`);
                    } else if (data.role === 'Group Leader') {
                        navigateTo(`/group_leader_dashboard/${data.user_id}`);
                    } else if (data.role === 'Admin') {
                        navigateTo(`/admin_dashboard/${data.user_id}`);
                    } else if (data.role === 'Staff') {
                        navigateTo(`/staff_dashboard/${data.user_id}`);
                    } else if (data.role === 'Manager') {
                        navigateTo(`/manager_dashboard/${data.user_id}`);
                    }
                }
                else {
                    console.error('User ID not provided in response.');
                }
            })
            .catch(error => {
                console.error('Login failed:', error);
                alert('Your username or password is wrong.')
            });
    };

    const handleFormChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    };


    return (
        <div>
            <h1>Welcome to Kiwi Camp</h1>
            <form>
                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleFormChange} placeholder="Enter your username" required></input>    
                <label>Password:</label>
                <input type={pwdHidden} value={formData.password} onChange={handleFormChange} name="password" placeholder="Enter password"></input>
                <button onClick={togglePwdShow}>Show Password</button>
                <button onClick={handleSubmit} type="submit">Login</button>
            </form>   
        </div>
    )
}