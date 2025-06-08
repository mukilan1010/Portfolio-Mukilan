import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const Skills = () => {
  const navigate=useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);
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
          width: ${Math.random() * 3 + 1}px;
          height: ${Math.random() * 3 + 1}px;
          background: ${Math.random() > 0.5 ? "#64ffda" : "#a855f7"};
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: ${Math.random() * 0.6 + 0.2};
          animation: float ${Math.random() * 15 + 15}s linear infinite;
          animation-delay: ${Math.random() * 5}s;
        `;
        canvasRef.current?.appendChild(dot);
        dots.push(dot);
      }
      return dots;
    };

    const dots = createFloatingDots();
    setTimeout(() => setIsLoaded(true), 800);

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

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://portfolio-mukilan-2.onrender.com/api/skills');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setSkills(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills data. Please check if your server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const glowStyle = {
    background: `radial-gradient(circle at ${
      ((mousePosition.x + 1) / 2) * 100
    }% ${
      ((1 - mousePosition.y) / 2) * 100
    }%, rgba(100, 255, 218, 0.08) 0%, transparent 50%)`,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 m-2 border-4 border-purple-400 border-b-transparent rounded-full animate-spin animate-reverse"></div>
          <p className="text-cyan-400 font-mono mt-6 text-center animate-pulse">Loading Skills Matrix...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6 bg-slate-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl border border-red-500/30">
          <div className="text-6xl text-red-400 animate-pulse">⚠️</div>
          <h2 className="text-2xl font-bold text-white">System Error</h2>
          <p className="text-gray-300 max-w-md">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!skills || skills.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6 bg-slate-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
          <div className="text-6xl text-gray-400 animate-pulse">🔧</div>
          <h2 className="text-2xl font-bold text-white">Skills Database Empty</h2>
          <p className="text-gray-300">No skill categories have been initialized yet.</p>
        </div>
      </div>
    );
  }

  const totalSkills = skills.reduce((total, category) => total + (category.skills?.length || 0), 0);
  const allSkills = skills.flatMap(category => category.skills || []);
  const avgProficiency = allSkills.length > 0 
    ? Math.round(allSkills.reduce((sum, skill) => sum + skill.level, 0) / allSkills.length)
    : 0;

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
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative z-20 min-h-screen px-6 py-16 transition-all duration-1000 delay-300 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        
        {/* Header Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <span className="text-cyan-400 text-sm font-mono bg-slate-800 bg-opacity-50 backdrop-blur-sm px-6 py-3 rounded-full border border-cyan-400/30 animate-pulse">
              &lt; Technical Arsenal /&gt;
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Skills <span className="text-purple-400">Matrix</span>
          </h1>
          
          <p className="text-xl text-gray-300 leading-relaxed">
            Mastery levels across the technological spectrum
          </p>
        </div>
        
     
        
        {/* Skills Grid */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {skills.map((category, categoryIndex) => (
              <div
                key={category._id}
                className="group bg-slate-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
                onMouseEnter={() => setActiveCategory(categoryIndex)}
                style={{ animationDelay: `${categoryIndex * 0.2}s` }}
              >
                
                {/* Category Header */}
                <div className="flex items-center mb-8">
                  <div className="text-4xl mr-6 p-4 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-xl border border-cyan-400/30 group-hover:border-cyan-400/60 transition-all duration-300">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                      {category.category}
                    </h3>
                    <p className="text-cyan-400 text-sm font-mono">
                      [{category.skills?.length || 0} technologies]
                    </p>
                  </div>
                </div>
                
                {/* Skills List */}
                <div className="space-y-6">
                  {category.skills && category.skills.length > 0 ? (
                    category.skills.map((skill, skillIndex) => (
                      <div key={skill._id || skillIndex} className="group/skill">
                        {/* Skill Name and Percentage */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold text-gray-200 group-hover/skill:text-white transition-colors duration-200">
                            {skill.name}
                          </span>
                          <span className="text-sm font-bold text-cyan-400 bg-slate-700 bg-opacity-50 px-3 py-1 rounded-full border border-cyan-400/30">
                            {skill.level}%
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="relative">
                          <div className="h-3 bg-slate-700 bg-opacity-50 rounded-full overflow-hidden border border-gray-600/30">
                            <div
                              className={`h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-1000 ease-out relative group-hover/skill:from-cyan-300 group-hover/skill:to-purple-400`}
                              style={{ 
                                width: `${skill.level}%`,
                                animationDelay: `${(categoryIndex * 0.3) + (skillIndex * 0.1)}s`
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -translate-x-full group-hover/skill:translate-x-full transition-transform duration-1000"></div>
                            </div>
                          </div>
                          
                          {/* Glow effect */}
                          <div 
                            className="absolute inset-0 h-3 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full blur-sm opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8 font-mono">
                      &lt; No skills initialized /&gt;
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
           {/* Stats Overview */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Skills", value: totalSkills, color: "cyan", icon: "⚡" },
              { label: "Categories", value: skills.length, color: "purple", icon: "📊" },
              { label: "Avg Mastery", value: `${avgProficiency}%`, color: "pink", icon: "🎯" },
              { label: "Experience", value: "3+ Yrs", color: "green", icon: "🚀" }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 border border-${stat.color}-400/30 hover:border-${stat.color}-400/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-${stat.color}-500/20`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className={`text-3xl font-bold text-${stat.color}-400 mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Skills Highlight */}
        {allSkills.length > 0 && (
          <div className="max-w-6xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-slate-800 via-purple-900/50 to-slate-800 rounded-2xl p-8 border border-purple-400/30 backdrop-blur-sm">
              <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Elite Proficiencies
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {allSkills
                  .sort((a, b) => b.level - a.level)
                  .slice(0, 6)
                  .map((skill, index) => (
                    <div
                      key={skill._id || index}
                      className="group bg-slate-800 bg-opacity-50 backdrop-blur-sm px-6 py-3 rounded-full border border-cyan-400/30 hover:border-cyan-400/60 hover:bg-opacity-70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/20"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="text-white font-medium group-hover:text-cyan-400 transition-colors duration-200">
                        {skill.name}
                      </span>
                      <span className="text-cyan-400 ml-2 font-bold">
                        {skill.level}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-slate-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to <span className="text-cyan-400">Collaborate</span>?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Let's build something extraordinary together with these technologies
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              
              <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-full font-semibold hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25" onClick={() => navigate('/contact')}>
                Start a Project
              </button>
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
            transform: translateY(-30px) translateX(15px) rotate(90deg);
          }
          50% {
            transform: translateY(-60px) translateX(-15px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) translateX(20px) rotate(270deg);
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

export default Skills;