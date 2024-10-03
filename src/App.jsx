import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Mainbar from './Components/Mainbar';
import Home from './pages/Home';
import MyGrades from './pages/MyGrades';
import Assignments from './pages/Assignments';
import Schedule from './pages/Schedule';
import StudyMaterial from './pages/StudyMaterial';
// import Announcements from './pages/Announcements';
// import UploadGrades from './pages/teacher/UploadGrades';
// import UploadStudyMaterial from './pages/teacher/UploadStudyMaterial';
// import StudentManagement from './pages/admin/StudentManagement';
import ClassesManager from './pages/admin/ClassesManager';
import Login2 from './Auth/Login2';
import SignUp2 from './Auth/SignUp2';
import { useState, useEffect } from 'react';
import ResourceManager from './pages/admin/ResourceManager/ResourceManager';
import Announcements from './pages/admin/Announcements/Announcements';
import AccountsManager from './pages/admin/AccountManager/AccountsManager';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('student'); // Role: 'student', 'teacher', 'admin'
  const [user, setUser] = useState({})

  // Simulate fetching authentication status and role from local storage or API
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    setRole(localStorage.getItem('role')); // set the role of the logged-in user
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    alert("Logged out successfully");
  };

  // Private Route Component
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login2 setIsAuthenticated={setIsAuthenticated} user={user} setUser={setUser}/>}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignUp2 />}
        />

        {/* Private Routes */}
        <Route
          path="*"
          element={
            <PrivateRoute>
              <div className="my-dashboard flex w-full h-screen text-white">
                <Sidebar role={role} onLogout={handleLogout} />
                <Mainbar>
                  <Routes>
                    {/* <Route path="/" element={<Home />} /> */}
                    <Route path="/" element={<AccountsManager />} />
                    {/* Role-Based Routes */}
                    {role === 'student' && (
                      <>
                        <Route path="/my-grades" element={<MyGrades />} />
                        <Route path="/class-schedule" element={<Schedule />} />
                        <Route path="/study-material" element={<StudyMaterial />} />
                        <Route path="/assignments" element={<Assignments />} />
                        {/*  <Route path="/announcements" element={<Announcements />} /> */}
                      </>
                    )}
                    {role === 'teacher' && (
                      <>
                        {/*   <Route path="/upload-grades" element={<UploadGrades />} /> */}
                        {/*  <Route path="/upload-study-material" element={<UploadStudyMaterial />} /> */}
                        {/*  <Route path="/announcements" element={<Announcements />} /> */}
                        {/*  <Route path="/assignments" element={<Assignments />} /> */}
                      </>
                    )}
                    {role === 'admin' && (
                      <>
                        <Route path="/classes-manager" element={<ClassesManager />} />
                        <Route path="/resource-manager" element={<ResourceManager />} />
                        <Route path="/announcements" element={<Announcements />} />
                        <Route path="/accounts-manager" element={<AccountsManager />} />
                      </>
                    )}
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
