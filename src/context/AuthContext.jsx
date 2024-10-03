import { createContext, useState, useContext } from 'react';
import { useAxios } from 'axios-hooks'; // Assuming you're using axios-hooks

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Set up axios login call (manual mode)
  const [{ data, loading, error }, loginCall] = useAxios(
    {
      url: 'http://localhost:3001/api/login',
      method: 'post',
    },
    { manual: true }
  );

  // Handle login by calling the API
  const login = async (enrollmentNumber, password) => {
    try {
      const response = await loginCall({ data: { enrollmentNumber, password } });
      if (response.data && response.data.role) {
        setIsAuthenticated(true);
        setUserRole(response.data.role); // Assuming the response contains the user's role
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
