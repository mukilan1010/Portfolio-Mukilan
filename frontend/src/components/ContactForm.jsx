import React, { useState, useEffect, useRef } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [storedContacts, setStoredContacts] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    // Create animated floating dots
    const createFloatingDots = () => {
      const dots = [];
      for (let i = 0; i < 20; i++) {
        const dot = document.createElement("div");
        dot.className = "floating-dot";
        dot.style.cssText = `
          position: absolute;
          width: ${Math.random() * 3 + 1}px;
          height: ${Math.random() * 3 + 1}px;
          background: ${Math.random() > 0.5 ? "#64ffda" : "#a855f7"};
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: ${Math.random() * 0.4 + 0.2};
          animation: float ${Math.random() * 40 + 40}s linear infinite;
          animation-delay: ${Math.random() * 10}s;
        `;
        canvasRef.current?.appendChild(dot);
        dots.push(dot);
      }
      return dots;
    };

    const dots = createFloatingDots();
    return () => {
      dots.forEach((dot) => dot.remove());
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const submitToAPI = async (contactData) => {
    const response = await fetch('https://portfolio-mukilan-2.onrender.com/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit form');
    }
    
    return result;
  };

  // Then update your handleSubmit function:
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await submitToAPI(formData);
      
      setSubmitStatus({
        type: 'success',
        message: `Thank you ${formData.name}! Your message has been stored successfully.`,
        contactId: result.data.id
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Sorry, there was an error. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const glowStyle = {
    background: `radial-gradient(circle at ${
      ((mousePosition.x + 1) / 2) * 100
    }% ${
      ((1 - mousePosition.y) / 2) * 100
    }%, rgba(100, 255, 218, 0.08) 0%, transparent 50%)`,
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div ref={canvasRef} className="absolute inset-0 z-0 overflow-hidden" />

      {/* Interactive Glow Effect */}
      <div
        className="absolute inset-0 z-10 pointer-events-none transition-all duration-300"
        style={glowStyle}
      />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen px-6 py-8">
        
        {/* Header Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-block mb-4">
            <span className="text-cyan-400 text-sm font-mono bg-slate-800 bg-opacity-50 backdrop-blur-sm px-6 py-2 rounded-full border border-cyan-400/30 animate-pulse">
              &lt; Get In Touch /&gt;
            </span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Contact Us
          </h1>
          
          <p className="text-lg text-gray-300 leading-relaxed">
            Let's discuss your next project and bring your ideas to life
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-slate-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="text-cyan-400 mr-3">💬</span>
              Send Message
            </h2>

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-700 bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:border-cyan-400 focus:ring-cyan-400'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-700 bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:border-cyan-400 focus:ring-cyan-400'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-700 bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.phone 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:border-cyan-400 focus:ring-cyan-400'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-700 bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                    errors.message 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:border-cyan-400 focus:ring-cyan-400'
                  }`}
                  placeholder="Tell us about your project or inquiry..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  isSubmitting
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-purple-600 hover:to-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/25'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Storing in Database...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    Send Message
                  </span>
                )}
              </button>
            </div>

            {/* Status Messages */}
            {submitStatus && (
              <div className={`mt-6 p-4 rounded-lg border ${
                submitStatus.type === 'success' 
                  ? 'bg-green-900 bg-opacity-50 border-green-500 text-green-400' 
                  : 'bg-red-900 bg-opacity-50 border-red-500 text-red-400'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">
                    {submitStatus.type === 'success' ? '✅' : '❌'}
                  </span>
                  <div>
                    <p className="font-semibold">{submitStatus.message}</p>
                    {submitStatus.contactId && (
                      <p className="text-sm mt-1 opacity-80">
                        Contact ID: #{submitStatus.contactId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Info & Database Status */}
          <div className="space-y-8">
            
            {/* Contact Information */}
            <div className="bg-slate-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="text-purple-400 mr-3">📞</span>
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                    📧
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-semibold">mukilan291024@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    📍
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white font-semibold">Chennai, India - 600001</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-600 rounded-full flex items-center justify-center">
                    🕒
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Response Time</p>
                    <p className="text-white font-semibold">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(-30px) translateX(20px) rotate(90deg);
          }
          50% {
            transform: translateY(-60px) translateX(-20px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) translateX(25px) rotate(270deg);
          }
        }

        .floating-dot {
          pointer-events: none;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default ContactForm;