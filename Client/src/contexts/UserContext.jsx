import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ isLoggedIn: false, id: null, role: null });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify({...userData, isLoggedIn: true}));
        setUser({...userData, isLoggedIn: true});
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser({ isLoggedIn: false, id: null, role: null });
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
