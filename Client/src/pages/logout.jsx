import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout({ setIsLoggedIn }) {
    const navigate = useNavigate();

    useEffect(() => {
        // Perform logout operations
        // Clear local storage or any other session data
        localStorage.removeItem('isLoggedIn'); // if you're using localStorage to manage login state

        // Update login state
        setIsLoggedIn(false);

        // Redirect to home page or login page
        navigate('/login');
    }, [setIsLoggedIn, navigate]);

    return null; // This component does not need to render anything
}