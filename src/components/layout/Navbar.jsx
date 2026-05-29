import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Clock, Phone, HeartPulse, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    // { name: 'Services', path: '/services' },
    { name: 'Find a Doctor', path: '/doctors' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Top Bar - Hidden on scroll */}
      <div className={`bg-primary-light text-slate-300 py-2.5 px-4 sm:px-6 lg:px-8 text-xs font-medium transition-all duration-300 hidden md:block ${scrolled ? 'h-0 opacity-0 overflow-hidden py-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Welcome to ApexCare Medical Center</span>
          </div>
          <div className="flex space-x-8 items-center">
            <span className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-secondary" /> 
              <span>Opening Hours: Mon to Sat - 8am to 10pm</span>
            </span>
            <span className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-secondary" />
              <span className="text-secondary font-semibold">+234-803-611-8721</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 ${scrolled ? 'glass shadow-md py-2' : 'bg-white/95 shadow-sm py-4'} relative z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="bg-primary p-2 rounded-xl group-hover:bg-primary-light transition-colors">
                  <HeartPulse className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-extrabold text-primary tracking-tight group-hover:text-primary-light transition-colors">
                  Apex<span className="text-secondary">Care</span>
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center ml-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`relative px-4 py-2 rounded-full font-semibold text-[14px] transition-all duration-300 overflow-hidden group ${
                    location.pathname === link.path 
                      ? 'text-secondary' 
                      : 'text-slate-600 hover:text-primary'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {location.pathname === link.path && (
                    <span className="absolute inset-0 bg-secondary/10 rounded-full scale-100 transition-transform"></span>
                  )}
                  <span className="absolute inset-0 bg-slate-100 rounded-full scale-0 group-hover:scale-100 transition-transform origin-center -z-0"></span>
                </Link>
              ))}
            </div>

            {/* Right Side Auth / Dashboard */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    className="flex items-center px-4 py-2 text-slate-700 font-semibold text-sm hover:text-secondary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="border-2 border-slate-200 text-slate-600 px-5 py-2 rounded-xl hover:border-red-500 hover:text-red-500 hover:bg-red-50 font-semibold text-sm transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-slate-600 font-semibold text-sm px-4 py-2 hover:text-secondary transition-colors">Login</Link>
                  <Link to="/register" className="bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 font-semibold text-sm transition-all flex items-center group">
                    Book Now
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-secondary focus:outline-none p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`lg:hidden absolute w-full glass-dark transition-all duration-300 origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
          <div className="px-4 py-6 space-y-2 max-h-[80vh] overflow-y-auto shadow-2xl rounded-b-3xl">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className={`block px-5 py-3 rounded-xl font-semibold text-[15px] transition-colors ${
                  location.pathname === link.path
                    ? 'bg-secondary/20 text-secondary'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-6 mt-4 border-t border-slate-700/50 flex flex-col space-y-3 px-1">
              {user ? (
                <>
                  <Link 
                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-5 py-3 text-center bg-slate-800 text-white font-semibold hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="block w-full text-center px-5 py-3 border border-slate-600 text-slate-300 font-semibold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 rounded-xl transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-5 py-3 text-center border border-slate-600 text-slate-300 font-semibold hover:text-white hover:border-slate-500 rounded-xl transition-colors">Login</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-5 py-3 text-center bg-secondary text-slate-900 font-bold hover:bg-secondary-dark rounded-xl shadow-lg transition-colors">Book Appointment</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
