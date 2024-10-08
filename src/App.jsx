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
import useToast from './Utils/UseToast';
import UploadGrades from './pages/teachers/UploadGrades';
import UploadStudyMaterial from './pages/teachers/UploadStudyMaterial';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(localStorage.getItem('role')); // Role: 'student', 'teacher', 'admin'
  const [user, setUser] = useState({})
  const [userId, setUserId] = useState(localStorage.getItem('userId'))
  const [classId, setClassId] = useState(localStorage.getItem('classId'))
  const { addToast, ToastContainer } = useToast();

  // Simulate fetching authentication status and role from local storage or API
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    setRole(localStorage.getItem('role')); // set the role of the logged-in user
    setClassId(localStorage.getItem('classId'));
    setUserId(localStorage.getItem('userId'));
  }, [isAuthenticated]);

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
          element={isAuthenticated ? <Navigate to="/" /> : <Login2 setIsAuthenticated={setIsAuthenticated} user={user} setUser={setUser} />}
        />
        <Route
          path="/signupppppp"
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
                    <Route path="/" element={<Home userRole={role} />} />
                    {/* <Route path="/" element={<AccountsManager />} /> */}
                    {/* Role-Based Routes */}
                    {role === 'student' && (
                      <>
                        <Route path="/my-grades" element={<MyGrades />} />
                        <Route path="/class-schedule" element={<Schedule userId={userId} classId={classId} />} />
                        <Route path="/study-material" element={<StudyMaterial />} />
                        <Route path="/assignments" element={<Assignments />} />
                        <Route path="/announcements" element={<Announcements role={role} />} />
                      </>
                    )}
                    {role === 'teacher' && (
                      <>
                        <Route path="/upload-grades" element={<UploadGrades />} />
                        <Route path="/upload-study-material" element={<UploadStudyMaterial />} />
                        <Route path="/announcements" element={<Announcements role={role} />} />
                        <Route path="/assignments" element={<Assignments />} />
                      </>
                    )}
                    {role === 'admin' && (
                      <>
                        <Route path="/classes-manager" element={<ClassesManager />} />
                        <Route path="/resource-manager" element={<ResourceManager />} />
                        <Route path="/announcements" element={<Announcements role={role} />} />
                        <Route path="/accounts-manager" element={<AccountsManager />} />
                      </>
                    )}
                  </Routes>
                </Mainbar>
              </div>
              <ToastContainer />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
