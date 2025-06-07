import React, { useState, useEffect, useRef } from 'react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Create animated floating dots
    const createFloatingDots = () => {
      const dots = [];
      for (let i = 0; i < 35; i++) {
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
          opacity: ${Math.random() * 0.7 + 0.3};
          animation: float ${Math.random() * 25 + 25}s linear infinite;
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
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/projects');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects data. Please check if your server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getProjectDescriptions = (project) => {
    const descriptions = [];
    if (project.description1) descriptions.push(project.description1);
    if (project.description2) descriptions.push(project.description2);
    if (project.description3) descriptions.push(project.description3);
    if (project.description4) descriptions.push(project.description4);
    return descriptions;
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
          <p className="text-cyan-400 font-mono mt-6 text-center animate-pulse">Loading Project Portfolio...</p>
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

  if (!projects || projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6 bg-slate-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
          <div className="text-6xl text-gray-400 animate-pulse">🚀</div>
          <h2 className="text-2xl font-bold text-white">Project Portfolio Empty</h2>
          <p className="text-gray-300">No projects have been showcased yet.</p>
        </div>
      </div>
    );
  }

  const totalProjects = projects.length;
  const projectsWithLinks = projects.filter(p => p.deploymentLink || p.githubLink).length;
  const projectsWithImages = projects.filter(p => p.screenshotUrl).length;

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
      <div className={`relative z-20 min-h-screen px-6 py-8 transition-all duration-1000 delay-300 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        
        {/* Header Section - Compact */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-block mb-4">
            <span className="text-cyan-400 text-sm font-mono bg-slate-800 bg-opacity-50 backdrop-blur-sm px-6 py-2 rounded-full border border-cyan-400/30 animate-pulse">
              &lt; Creative Showcase /&gt;
            </span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Projects
          </h1>
          
          <p className="text-lg text-gray-300 leading-relaxed">
            Innovative solutions crafted with passion and precision
          </p>
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const descriptions = getProjectDescriptions(project);
              
              return (
                <div
                  key={project._id}
                  className="group bg-slate-800 bg-opacity-30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
                    {project.screenshotUrl ? (
                      <img 
                        src={`http://localhost:5000${project.screenshotUrl}`}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`${project.screenshotUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-6xl text-gray-600`}>
                      🎨
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex space-x-2">
                          {project.deploymentLink && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.deploymentLink, '_blank');
                              }}
                              className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-400 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <span>🌐</span>
                              <span>Demo</span>
                            </button>
                          )}
                          {project.githubLink && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.githubLink, '_blank');
                              }}
                              className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-400 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <span>⭐</span>
                              <span>Code</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    
                    {/* Descriptions */}
                    {descriptions.length > 0 && (
                      <div className="space-y-3 mb-6">
                        {descriptions.slice(0, 2).map((desc, descIndex) => (
                          <p key={descIndex} className="text-gray-300 text-sm leading-relaxed">
                            {desc}
                          </p>
                        ))}
                        {descriptions.length > 2 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project);
                            }}
                            className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors duration-200"
                          >
                            Read more...
                          </button>
                        )}
                      </div>
                    )}

                    {/* Project Links */}
                    <div className="flex space-x-3">
                      {project.deploymentLink && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.deploymentLink, '_blank');
                          }}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-all duration-200 text-sm"
                        >
                          View Live
                        </button>
                      )}
                      {project.githubLink && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.githubLink, '_blank');
                          }}
                          className="flex-1 px-4 py-2 border-2 border-purple-400 text-purple-400 rounded-lg font-semibold hover:bg-purple-400 hover:text-white transition-all duration-200 text-sm"
                        >
                          Source
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Projects", value: totalProjects, color: "cyan", icon: "🚀" },
              { label: "Live Demos", value: projectsWithLinks, color: "purple", icon: "🌐" },
              { label: "With Visuals", value: projectsWithImages, color: "pink", icon: "📸" },
              { label: "Open Source", value: projects.filter(p => p.githubLink).length, color: "green", icon: "⭐" }
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

        {/* Call to Action */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-slate-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h3 className="text-3xl font-bold text-white mb-4">
              Have a <span className="text-cyan-400">Project Idea</span>?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Let's collaborate and bring your vision to life with cutting-edge technology
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25">
                <span className="relative z-10">Start a Project</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-full font-semibold hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25">
                View More Work
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-slate-800 bg-opacity-95 backdrop-blur-sm rounded-2xl border border-cyan-400/30">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center transition-colors duration-200"
            >
              ✕
            </button>
            
            <div className="p-8">
              {/* Modal Image */}
              {selectedProject.screenshotUrl && (
                <div className="mb-8 rounded-xl overflow-hidden">
                  <img 
                    src={`http://localhost:5000${selectedProject.screenshotUrl}`}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              
              {/* Modal Content */}
              <h2 className="text-3xl font-bold">
                {selectedProject.title}
              </h2>
              
              {getProjectDescriptions(selectedProject).map((desc, index) => (
                <p key={index} className="text-gray-300 leading-relaxed mb-4">
                  {desc}
                </p>
              ))}
              
              {/* Modal Links */}
              <div className="flex space-x-4 mt-8">
                {selectedProject.deploymentLink && (
                  <button 
                    onClick={() => window.open(selectedProject.deploymentLink, '_blank')}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-all duration-200"
                  >
                    🌐 View Live Demo
                  </button>
                )}
                {selectedProject.githubLink && (
                  <button 
                    onClick={() => window.open(selectedProject.githubLink, '_blank')}
                    className="px-6 py-3 border-2 border-purple-400 text-purple-400 rounded-lg font-semibold hover:bg-purple-400 hover:text-white transition-all duration-200"
                  >
                    ⭐ View Source Code
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
            transform: translateY(-50px) translateX(25px) rotate(90deg);
          }
          50% {
            transform: translateY(-100px) translateX(-25px) rotate(180deg);
          }
          75% {
            transform: translateY(-50px) translateX(30px) rotate(270deg);
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

export default Projects;