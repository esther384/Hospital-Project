import React from 'react';
import { HeartPulse, Mail, Phone, MapPin, ArrowRight, Globe, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-slate-300 pt-16 pb-8 border-t border-primary-light relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center space-x-2 mb-6 group inline-flex">
              <div className="bg-secondary/20 p-2 rounded-xl group-hover:bg-secondary/30 transition-colors">
                <HeartPulse className="h-7 w-7 text-secondary" />
              </div>
              <span className="text-3xl font-extrabold text-white tracking-tight">
                Apex<span className="text-secondary">Care</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-8 text-slate-400">
              Providing exceptional medical care and prioritizing your health and well-being every day. Experience enterprise-grade healthcare with our world-class specialists.
            </p>
            <div className="flex space-x-4">
              {[Globe, MessageCircle, Mail, Phone].map((Icon, i) => (
                <a key={i} href="#" className="bg-primary-light p-2.5 rounded-xl hover:bg-secondary hover:text-white transition-all duration-300 hover:-translate-y-1">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/" className="hover:text-secondary transition-colors flex items-center group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />Home</Link></li>
              <li><Link to="/about" className="hover:text-secondary transition-colors flex items-center group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />About Us</Link></li>
              <li><Link to="/doctors" className="hover:text-secondary transition-colors flex items-center group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />Our Doctors</Link></li>
              <li><Link to="/services" className="hover:text-secondary transition-colors flex items-center group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />Services</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors flex items-center group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />Contact</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
              Departments
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li className="hover:text-white transition-colors cursor-pointer">Cardiology</li>
              <li className="hover:text-white transition-colors cursor-pointer">Neurology</li>
              <li className="hover:text-white transition-colors cursor-pointer">Pediatrics</li>
              <li className="hover:text-white transition-colors cursor-pointer">Orthopedics</li>
              <li className="hover:text-white transition-colors cursor-pointer">General Surgery</li>
            </ul>
          </div>
          
          {/* Contact & Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
              Get In Touch
            </h3>
            <ul className="space-y-4 text-sm mb-8">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span className="leading-relaxed">450 Apex Medical Plaza, New York, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <span className="font-semibold text-white">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span>contact@apexcare.com</span>
              </li>
            </ul>

            <div className="bg-primary-light p-1.5 rounded-xl flex items-center focus-within:ring-2 focus-within:ring-secondary transition-all">
              <input 
                type="email" 
                placeholder="Subscribe to newsletter" 
                className="bg-transparent border-none outline-none px-3 py-2 text-sm w-full text-white placeholder-slate-400"
              />
              <button className="bg-secondary text-primary font-bold px-4 py-2 rounded-lg hover:bg-secondary-dark transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-primary-light/50 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ApexCare Medical Center. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
