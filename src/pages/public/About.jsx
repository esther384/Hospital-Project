import React from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Activity className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">About HealthCare</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are dedicated to providing accessible, high-quality medical services to our community. 
            Our modern facilities and expert staff ensure you receive the best care possible.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Hospital Facility" 
                className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                To improve the health and well-being of the people we serve by ensuring highly effective, 
                community-based support and care. We aim to be a national leader in healthcare innovation, 
                providing outstanding service tailored to each patient.
              </p>
              
              <ul className="space-y-4 mt-8">
                {[
                  'State-of-the-art Medical Technologies',
                  'Compassionate and Experienced Staff',
                  '24/7 Emergency Care and Support',
                  'Patient-Centered Approach'
                ].map((item, id) => (
                  <li key={id} className="flex items-center text-gray-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <div className="pt-6">
                <Link to="/contact" className="text-primary font-bold hover:text-primary-dark transition-colors flex items-center">
                  Get in touch with us 
                  <span className="ml-2 text-xl">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default About;
