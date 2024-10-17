// src/components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import './components.css'
import '../index.css'

function Sidebar({ role = "", onLogout = () => { } }) {
  const location = useLocation();

  return (
    <aside className="sidebar w-1/5 ">
      <div className="logo 2xl:text-5xl text-4xl text-center p-8 tracking-wide">
        <Link to={'/'}>
          SGSITS mate
        </Link>
      </div>
      <ul className="nav-links 2xl:text-3xl xl:text-xl text-base">
        {/* Role-Based Sidebar Links */}
        {role === 'student' && (
          <>
            <li title="View your grades" className={location.pathname === '/my-grades' ? 'active' : ''}>
              <Link to="/my-grades">My Grades</Link>
            </li>
            <li title="View your class schedule" className={location.pathname === '/class-schedule' ? 'active' : ''}>
              <Link to="/class-schedule">Class Schedule</Link>
            </li>
            <li title="Access study materials" className={location.pathname === '/study-material' ? 'active' : ''}>
              <Link to="/study-material">Study Material</Link>
            </li>
            <li title="View and submit assignments" className={location.pathname === '/assignments' ? 'active' : ''}>
              <Link to="/assignments">Assignments</Link>
            </li>
            <li title="View announcements" className={location.pathname === '/announcements' ? 'active' : ''}>
              <Link to="/announcements">Announcements</Link>
            </li>
          </>
        )}

        {role === 'teacher' && (
          <>
            <li title="Upload grades for students" className={location.pathname === '/upload-grades' ? 'active' : ''}>
              <Link to="/upload-grades">Upload Grades</Link>
            </li>
            <li title="Upload study materials" className={location.pathname === '/upload-study-material' ? 'active' : ''}>
              <Link to="/upload-study-material">Upload Study Material</Link>
            </li>
            <li title="Make announcements to students" className={location.pathname === '/announcements' ? 'active' : ''}>
              <Link to="/announcements">Announcements</Link>
            </li>
            <li title="View and assign assignments" className={location.pathname === '/assignments' ? 'active' : ''}>
              <Link to="/assignments">Assignments</Link>
            </li>
          </>
        )}

        {role === 'admin' && (
          <>
            <li title="Manage school resources" className={location.pathname === '/resource-manager' ? 'active' : ''}>
              <Link to="/resource-manager">Resource Manager</Link>
            </li>
            <li title="Manage classes and their details" className={location.pathname === '/classes-manager' ? 'active' : ''}>
              <Link to="/classes-manager">Class Manager</Link>
            </li>
            <li title="Make announcements to everyone" className={location.pathname === '/announcements' ? 'active' : ''}>
              <Link to="/announcements">Announcements</Link>
            </li>
            <li title="Manage teacher and student accounts" className={location.pathname === '/accounts-manager' ? 'active' : ''}>
              <Link to="/accounts-manager">Accounts Manager</Link>
            </li>
            <li title="Set marks uploading permissions for teachers" className={location.pathname === '/upload-permissions' ? 'active' : ''}>
              <Link to="/upload-permissions">Upload Permissions</Link>
            </li>
          </>
        )}
      </ul>
      <button onClick={onLogout} className="logout-button mt-4 p-2">Logout</button>
    </aside>
  );
}

export default Sidebar;
