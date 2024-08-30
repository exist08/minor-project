// src/components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import './components.css'
import '../index.css'

const Sidebar = () => {
    // const { user } = useContext(AppContext);
    const location = useLocation();
    return (
        <aside className="sidebar w-1/5 ">
            <div className="logo 2xl:text-5xl text-4xl text-center p-8 tracking-wide">
                <Link to={'/'}>
                    SGSITS mate
                </Link>
            </div>
            <ul className="nav-links 2xl:text-3xl xl:text-xl text-base">
                {/* <li className={location.pathname === '/attendence' ? 'active' : ''}><Link style={{display: 'inline-block', width: '100%', height: '100%'}} to={'/attendence'}>Attendence</Link></li> */}
                <li className={location.pathname === '/my-grades' ? 'active' : ''}><Link style={{ display: 'inline-block', width: '100%', height: '100%' }} to={'/my-grades'}>My Grades</Link></li>
                <li className={location.pathname === '/class-schedule' ? 'active' : ''}><Link style={{ display: 'inline-block', width: '100%', height: '100%' }} to={'/class-schedule'}>Class Schedule</Link></li>
                <li className={location.pathname === '/study-material' ? 'active' : ''}><Link style={{ display: 'inline-block', width: '100%', height: '100%' }} to={'/study-material'}>Study Material</Link></li>
                <li className={location.pathname === '/assignments' ? 'active' : ''}><Link style={{ display: 'inline-block', width: '100%', height: '100%' }} to={'/assignments'}>Assignments</Link></li>
            </ul>
            <button>logout &rArr;</button>
        </aside>
    );
};

export default Sidebar;
