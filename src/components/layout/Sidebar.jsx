import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  User, 
  Users, 
  LogOut, 
  Activity,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isAdmin, isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) onClose();
  };

  const patientLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5" />, exact: true },
    { name: 'Book Appointment', path: '/dashboard/book', icon: <Calendar className="w-5 h-5" /> },
    { name: 'My Appointments', path: '/dashboard/appointments', icon: <Activity className="w-5 h-5" /> },
    { name: 'Profile Settings', path: '/dashboard/profile', icon: <User className="w-5 h-5" /> },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: <Home className="w-5 h-5" />, exact: true },
    { name: 'Manage Doctors', path: '/admin/doctors', icon: <Activity className="w-5 h-5" /> },
    { name: 'Manage Patients', path: '/admin/patients', icon: <Users className="w-5 h-5" /> },
    { name: 'All Appointments', path: '/admin/appointments', icon: <Calendar className="w-5 h-5" /> },
  ];

  const links = isAdmin ? adminLinks : patientLinks;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-40 flex flex-col pt-6
          transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:shadow-lg lg:z-auto lg:flex-shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="px-6 flex items-center justify-between mb-10">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-800">
              {isAdmin ? 'Admin Portal' : 'Patient Portal'}
            </span>
          </div>
          {/* Close button — only visible on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Welcome</p>
          <p className="text-gray-800 font-medium truncate">{user?.name || 'User'}</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.exact}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`
              }
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-600 hover:text-red-500 transition-colors w-full px-4 py-3 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
