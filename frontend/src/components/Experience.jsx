import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
const Experience = () => {
  const navigate=useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Create animated floating dots
    const createFloatingDots = () => {
      const dots = [];
      for (let i = 0; i < 25; i++) {
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
          opacity: ${Math.random() * 0.8 + 0.2};
          animation: float ${Math.random() * 20 + 20}s linear infinite;
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
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://portfolio-mukilan-2.onrender.com/api/experiences");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setExperiences(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching experiences:", err);
        setError(
          "Failed to load experience data. Please check if your server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0) {
      return `${years}y ${remainingMonths}m`;
    } else if (years > 0) {
      return `${years}y`;
    } else {
      return `${remainingMonths}m`;
    }
  };

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
          <p className="text-cyan-400 font-mono mt-6 text-center animate-pulse">
            Loading Experience Timeline...
          </p>
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

  if (!experiences || experiences.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6 bg-slate-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
          <div className="text-6xl text-gray-400 animate-pulse">💼</div>
          <h2 className="text-2xl font-bold text-white">
            Experience Database Empty
          </h2>
          <p className="text-gray-300">
            No work experiences have been added yet.
          </p>
        </div>
      </div>
    );
  }

  const totalExperience = experiences.reduce((total, exp) => {
    const duration = calculateDuration(exp.startDate, exp.endDate);
    const months = duration.includes("y")
      ? parseInt(duration.split("y")[0]) * 12 +
        (duration.includes("m")
          ? parseInt(duration.split("y")[1].split("m")[0])
          : 0)
      : parseInt(duration.split("m")[0]);
    return total + months;
  }, 0);

  const totalYears = Math.floor(totalExperience / 12);
  const totalMonths = totalExperience % 12;

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
      <div
        className={`relative z-20 min-h-screen px-6 py-16 transition-all duration-1000 delay-300 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Header Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <span className="text-cyan-400 text-sm font-mono bg-slate-800 bg-opacity-50 backdrop-blur-sm px-6 py-3 rounded-full border border-cyan-400/30 animate-pulse">
              &lt; Professional Journey /&gt;
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Experience <span className="text-purple-400">Timeline</span>
          </h1>

          <p className="text-xl text-gray-300 leading-relaxed">
            A chronicle of professional growth and achievements
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-purple-500 to-cyan-400 transform md:-translate-x-1/2"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <div
                  key={experience._id}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } flex-col md:space-x-8`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full border-4 border-slate-900 transform md:-translate-x-1/2 z-10 shadow-lg shadow-cyan-400/50">
                    <div className="absolute inset-1 bg-white rounded-full animate-pulse"></div>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`w-full md:w-5/12 ml-20 md:ml-0 ${
                      index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    }`}
                  >
                    <div className="group bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10">
                      {/* Date Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="bg-gradient-to-r from-cyan-400/20 to-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-400/30">
                          <span className="text-cyan-400 font-mono text-sm">
                            {formatDate(experience.startDate)} -{" "}
                            {formatDate(experience.endDate)}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm font-medium">
                          {calculateDuration(
                            experience.startDate,
                            experience.endDate
                          )}
                        </div>
                      </div>

                      {/* Role and Company */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                          {experience.role}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-400 font-semibold text-lg">
                            {experience.company}
                          </span>
                          {!experience.endDate && (
                            <span className="bg-green-400/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-400/30 animate-pulse">
                              Current
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {experience.description && (
                        <ul className="text-gray-300 leading-relaxed list-disc pl-6 text-left">
                          {experience.description
                            .split("•")
                            .filter((point) => point.trim() !== "")
                            .map((point, index) => (
                              <li key={index} className="mb-1">
                                {point.trim()}
                              </li>
                            ))}
                        </ul>
                      )}

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Spacer for desktop */}
                  <div className="hidden md:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Stats Overview */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: "Total Experience",
                value: `${totalYears}+ Years`,
                color: "cyan",
                icon: "⏱️",
              },
              {
                label: "Positions",
                value: experiences.length,
                color: "purple",
                icon: "💼",
              },
              {
                label: "Companies",
                value: new Set(experiences.map((exp) => exp.company)).size,
                color: "pink",
                icon: "🏢",
              },
              {
                label: "Current Role",
                value: experiences.find((exp) => !exp.endDate)
                  ? "Active"
                  : "Seeking",
                color: "green",
                icon: "🚀",
              },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 border border-${stat.color}-400/30 hover:border-${stat.color}-400/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-${stat.color}-500/20`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div
                    className={`text-3xl font-bold text-${stat.color}-400 mb-2`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-slate-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready for the <span className="text-cyan-400">Next Chapter</span>?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Let's discuss how my experience can contribute to your team's
              success
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25">
                <span className="relative z-10">Download Resume</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-full font-semibold hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25" onClick={()=>navigate('/contact')}>
                Get in Touch
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
          0%,
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(-40px) translateX(20px) rotate(90deg);
          }
          50% {
            transform: translateY(-80px) translateX(-20px) rotate(180deg);
          }
          75% {
            transform: translateY(-40px) translateX(25px) rotate(270deg);
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

export default Experience;
