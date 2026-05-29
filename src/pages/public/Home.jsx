import React, { useState, useEffect } from 'react';
import { ArrowRight, Activity, Users, Calendar as CalendarIcon, Shield, Clock, Phone, HeartPulse, Star, CheckCircle2, ChevronRight, Stethoscope, Microscope, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDoctors } from '../../services/firebaseServices';
import DoctorCard from '../../components/DoctorCard';

const Home = () => {
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setTopDoctors(data.slice(0, 3)); // Get top 3 doctors
      } catch (error) {
        console.error('Failed to load doctors', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-secondary/10 blur-[100px]"></div>
          <div className="absolute top-40 -left-20 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Hero Text */}
            <div className="max-w-2xl animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-100 mb-6">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                </span>
                <span className="text-sm font-bold text-primary">Accepting New Patients</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-primary leading-[1.1] mb-6 tracking-tight">
                Advanced Care, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Exceptional Healing</span>
              </h1>
              
              <p className="text-lg text-slate-600 font-medium mb-10 max-w-lg leading-relaxed">
                At ApexCare, we combine state-of-the-art technology with compassionate, patient-centered care. From preventative medicine to complex surgical procedures, our expert team is dedicated to providing comprehensive healing and long-term wellness for you and your family.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="bg-primary hover:bg-primary-light text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center group shadow-xl shadow-primary/20 hover:-translate-y-1">
                  Book Appointment
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/doctors" className="bg-white hover:bg-slate-50 text-primary font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center group shadow-sm border border-slate-200 hover:-translate-y-1">
                  Meet Our Doctors
                </Link>
              </div>
              
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} className="w-12 h-12 rounded-full border-4 border-white object-cover" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Patient" />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="text-sm font-bold text-slate-700 mt-1">From 10,000+ Reviews</span>
                </div>
              </div>
            </div>

            {/* Hero Images & Floating Cards */}
            <div className="relative hidden lg:block h-[600px] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {/* Main Image */}
              <div className="absolute right-0 top-10 w-[85%] h-[90%] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img src="https://images.unsplash.com/photo-1612349317150-e410f624c427?auto=format&fit=crop&w=1000&q=80" alt="ApexCare Doctor" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
              </div>

              {/* Floating Widget 1 */}
              <div className="absolute top-32 -left-10 glass rounded-2xl p-5 shadow-2xl animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500">Certified</p>
                    <p className="text-lg font-extrabold text-primary">Top Specialists</p>
                  </div>
                </div>
              </div>

              {/* Floating Widget 2 */}
              <div className="absolute bottom-20 -left-4 glass rounded-2xl p-5 shadow-2xl animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center border-2 border-white"><CheckCircle2 className="w-5 h-5 text-white" /></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500">Success Rate</p>
                    <p className="text-lg font-extrabold text-primary">99.8%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Widget - Overlapping Hero */}
      <section className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 mb-24">
        <div className="glass-dark rounded-[2rem] p-2 md:p-4 shadow-2xl border border-slate-700 overflow-hidden">
          <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-0">
            <div className="md:col-span-3 lg:col-span-4 bg-white rounded-3xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
                <CalendarIcon className="w-6 h-6 mr-2 text-secondary" />
                Quick Appointment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all">
                    <option>Select Department</option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doctor</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all">
                    <option>Choose Doctor</option>
                    <option>Dr. Sarah Jenkins</option>
                    <option>Dr. Michael Chen</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
                  <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" />
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-secondary/30">
                    Check Availability
                  </button>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex flex-col justify-center items-center p-8 text-center bg-transparent">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-secondary" />
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">Emergency 24/7</p>
              <p className="text-white font-extrabold text-lg">+1-800-APEX-CARE</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-secondary font-extrabold tracking-wider uppercase text-sm mb-2 block">Departments</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-6">Our Centers of Excellence</h2>
            <p className="text-slate-600 text-lg">We provide specialized care across multiple disciplines, utilizing state-of-the-art technology and evidence-based practices.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <HeartPulse className="w-8 h-8" />, title: 'Cardiology', desc: 'Comprehensive heart care from prevention to complex surgeries.', color: 'from-red-500 to-rose-500' },
              { icon: <Brain className="w-8 h-8" />, title: 'Neurology', desc: 'Expert treatment for disorders of the brain, spine, and nervous system.', color: 'from-secondary to-accent' },
              { icon: <Microscope className="w-8 h-8" />, title: 'Laboratory', desc: 'Advanced diagnostics with quick, accurate testing and results.', color: 'from-violet-500 to-purple-500' },
              { icon: <Stethoscope className="w-8 h-8" />, title: 'General Medicine', desc: 'Primary care focused on holistic health and disease prevention.', color: 'from-emerald-500 to-teal-500' },
              { icon: <Activity className="w-8 h-8" />, title: 'Emergency', desc: '24/7 trauma and urgent care with rapid response teams.', color: 'from-orange-500 to-amber-500' },
              { icon: <Users className="w-8 h-8" />, title: 'Pediatrics', desc: 'Specialized, compassionate care for infants, children, and adolescents.', color: 'from-blue-500 to-cyan-500' },
            ].map((feature, idx) => (
              <div key={idx} className="group bg-slate-50 rounded-[2rem] p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 group-hover:opacity-10 rounded-bl-[100px] transition-opacity duration-500" />
                
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{feature.desc}</p>
                
                <Link to="/services" className="inline-flex items-center font-bold text-secondary group-hover:text-primary transition-colors">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background Blob */}
        <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-secondary font-extrabold tracking-wider uppercase text-sm mb-2 block">Our Specialists</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">Meet Our Top Doctors</h2>
              <p className="text-slate-600 text-lg">Dedicated professionals committed to providing the highest standard of healthcare.</p>
            </div>
            <Link to="/doctors" className="hidden md:flex items-center bg-white border border-slate-200 text-primary font-bold px-6 py-3 rounded-full hover:shadow-md hover:border-secondary transition-all group">
              View All Doctors
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              </div>
            ) : topDoctors.length > 0 ? (
              topDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500">No doctors available.</div>
            )}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link to="/doctors" className="inline-flex items-center bg-white border border-slate-200 text-primary font-bold px-6 py-3 rounded-full shadow-sm">
              View All Doctors
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1920&q=80')] opacity-10 mix-blend-overlay bg-cover bg-center"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to prioritize your health?</h2>
          <p className="text-xl text-slate-300 mb-10">Join thousands of patients who trust ApexCare Medical Center for their healthcare needs.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-secondary hover:bg-white text-primary font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-white/20 hover:-translate-y-1">
              Create an Account
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-slate-400 hover:border-white text-white font-bold py-4 px-10 rounded-full transition-all duration-300 hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
