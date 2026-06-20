import React from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, UserPlus } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <GraduationCap size={28} />
          <span>EduManage</span>
        </NavLink>
        <ul className="navbar-menu">
          <li>
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/add" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <UserPlus size={18} />
              <span>Add Student</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
