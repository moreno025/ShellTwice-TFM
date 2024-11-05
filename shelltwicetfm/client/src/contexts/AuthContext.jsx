import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);
    const [rol, setRol] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedRol = Number(localStorage.getItem('rol'));
    
        console.log("Cargando AuthContext:", { token, storedUserId, storedRol });
    
        if (token && storedUserId && !isNaN(storedRol)) {
            setIsAuthenticated(true);
            setUserId(storedUserId);
            setRol(storedRol);
        }
    }, []);
    

    const login = (token, userId, userRol) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('rol', userRol);
        setIsAuthenticated(true);
        setUserId(userId);
        setRol(Number(userRol));
    };
    

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
        setUserId(null);
        setRol(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, userId, rol }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
