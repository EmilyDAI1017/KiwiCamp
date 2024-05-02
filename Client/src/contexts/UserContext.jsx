import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ isLoggedIn: false, id: null, role: null });

    const login = (userData) => {
        setUser({ ...userData, isLoggedIn: true });
    };

    const logout = () => {
        setUser({ isLoggedIn: false, id: null, role: null });
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
