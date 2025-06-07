import React, { useState, useEffect, useRef } from 'react';

const About = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Create animated floating dots
    const createFloatingDots = () => {
      const dots = [];
      for (let i = 0; i < 30; i++) {
        const dot = document.createElement("div");
        dot.className = "floating-dot";
        dot.style.cssText = `
          position: absolute;
          width: ${Math.random() * 4 + 2}px;
          height: ${Math.random() * 4 + 2}px;
          background: ${Math.random() > 0.5 ? "#64ffda" : "#a855f7"};
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: ${Math.random() * 0.6 + 0.4};
          animation: float ${Math.random() * 30 + 30}s linear infinite;
          animation-delay: ${Math.random() * 10}s;
        `;
        canvasRef.current?.appendChild(dot);
        dots.push(dot);
      }
      return dots;
    };

    const dots = createFloatingDots();
    setTimeout(() => setIsLoaded(true), 1000);

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

  const interests = [
    { title: "Problem Solving", description: "Love tackling complex challenges and finding elegant solutions", icon: "🧩" },
    { title: "Full-Stack Development", description: "Building end-to-end applications from frontend to backend", icon: "💻" },
    { title: "Real-World Solutions", description: "Creating applications that solve actual problems people face", icon: "🌍" },
    { title: "Scalable Architecture", description: "Designing systems that grow with user needs", icon: "📈" }
  ];

  const glowStyle = {
    background: `radial-gradient(circle at ${
      ((mousePosition.x + 1) / 2) * 100
    }% ${
      ((1 - mousePosition.y) / 2) * 100
    }%, rgba(100, 255, 218, 0.1) 0%, transparent 50%)`,
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

      {/* Loading Animation */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900 flex items-center justify-center transition-all duration-1000 ${
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 m-2 border-4 border-purple-400 border-b-transparent rounded-full animate-spin animate-reverse"></div>
          <p className="text-cyan-400 font-mono mt-6 text-center animate-pulse">Loading Profile...</p>
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative z-20 min-h-screen px-6 py-8 transition-all duration-1000 delay-300 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        
        {/* Header Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-block mb-4">
            <span className="text-cyan-400 text-sm font-mono bg-slate-800 bg-opacity-50 backdrop-blur-sm px-6 py-2 rounded-full border border-cyan-400/30 animate-pulse">
              &lt; Developer Profile /&gt;
            </span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            About Me
          </h1>
          
          <p className="text-lg text-gray-300 leading-relaxed">
            Passionate about creating impactful digital experiences
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Hero Section */}
          <div className="flex justify-center">
            
            {/* Profile Info - Centered */}
            <div className="max-w-3xl">
              <div className="bg-slate-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    M
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Mukilan N</h2>
                    <p className="text-cyan-400 font-semibold">Full-Stack Developer</p>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  I am Mukilan, a passionate Frontend Developer with experience in building user-friendly and interactive web applications. I have expertise in HTML, CSS, JavaScript, React, and backend technologies like FastAPI and MongoDB. My projects focus on real-world problem-solving with scalable solutions.
                </p>
                
                <p className="text-gray-300 leading-relaxed mb-8">
                  I'm very much interested in solving problems and creating applications that make a real difference in people's lives. Every project I work on is an opportunity to learn something new and push the boundaries of what's possible.
                </p>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <span className="text-cyan-400 text-xl">📧</span>
                    <a href="mailto:mukilan291024@gmail.com" className="hover:text-cyan-400 transition-colors duration-200">
                      mukilan291024@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <span className="text-purple-400 text-xl">📍</span>
                    <span>Chennai, India - 600001</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interests & Passion Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-4">
                What Drives Me <span className="text-cyan-400">🚀</span>
              </h3>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                My passion lies in creating meaningful solutions that bridge the gap between complex problems and elegant implementations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {interests.map((interest, index) => (
                <div
                  key={interest.title}
                  className="group bg-slate-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {interest.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                      {interest.title}
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {interest.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="bg-slate-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <h3 className="text-3xl font-bold text-white mb-4">
                Let's Build Something <span className="text-cyan-400">Amazing</span> Together
              </h3>
              <p className="text-gray-300 mb-8 text-lg">
                I'm always excited to collaborate on innovative projects and tackle new challenges. Whether you have an idea or need a developer to bring your vision to life, let's connect!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a 
                  href="mailto:mukilan291024@gmail.com"
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>📧</span>
                    <span>Get In Touch</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-full font-semibold hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25 flex items-center justify-center space-x-2">
                  <span>📋</span>
                  <span>View Resume</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-spin-reverse {
          animation: spin 15s linear infinite reverse;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(-60px) translateX(30px) rotate(90deg);
          }
          50% {
            transform: translateY(-120px) translateX(-30px) rotate(180deg);
          }
          75% {
            transform: translateY(-60px) translateX(35px) rotate(270deg);
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

export default About;