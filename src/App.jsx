import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Sidebar from './Components/Sidebar'
import Mainbar from './Components/Mainbar'
import Home from './pages/Home'
import Attendence from './pages/Attendence'
import MyGrades from './pages/MyGrades'
import Assignments from './pages/Assignments'
import Schedule from './pages/Schedule'
import StudyMaterial from './pages/StudyMaterial'
import { useState } from 'react'
import Login from './Auth/Login'
import SignUp from './Auth/SignUp'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate fetching authentication status from local storage or API
  // useEffect(() => {
  //   const token = localStorage.getItem('authToken');
  //   setIsAuthenticated(!!token); // Set to true if token exists
  // }, []);

  // Handle logout
  const handleLogout = () => {
    // localStorage.removeItem('authToken');
    // setIsAuthenticated(false);
    alert("Logged out successfully")
  };

  // Private Route Component
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Private Routes */}
        <Route
          path="*"
          element={
            <PrivateRoute>
              <div className="my-dashboard flex w-full h-screen text-white">
                <Sidebar onLogout={handleLogout} />
                <Mainbar>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/attendence" element={<Attendence />} />
                    <Route path="/my-grades" element={<MyGrades />} />
                    <Route path="/class-schedule" element={<Schedule />} />
                    <Route path="/study-material" element={<StudyMaterial />} />
                    <Route path="/assignments" element={<Assignments />} />
                  </Routes>
                </Mainbar>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
