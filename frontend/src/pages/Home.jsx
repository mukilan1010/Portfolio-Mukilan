import React, { useState, useEffect, useRef } from "react";
import profileImage from "../assets/Mukilan.png"; // adjust the path based on file location
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    // Create animated floating dots as 3D alternative
    const createFloatingDots = () => {
      const dots = [];
      for (let i = 0; i < 50; i++) {
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
          animation: float ${Math.random() * 10 + 10}s linear infinite;
          animation-delay: ${Math.random() * 5}s;
        `;
        canvasRef.current?.appendChild(dot);
        dots.push(dot);
      }
      return dots;
    };

    const dots = createFloatingDots();

    // Loading animation
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

  const glowStyle = {
    background: `radial-gradient(circle at ${
      ((mousePosition.x + 1) / 2) * 100
    }% ${
      ((1 - mousePosition.y) / 2) * 100
    }%, rgba(100, 255, 218, 0.1) 0%, transparent 50%)`,
  };

  const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/mukilan1010",
    icon: <FaGithub />,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/mukilan-n-90a8ab25a/",
    icon: <FaLinkedin />,
  }
];

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
        className={`relative z-20 min-h-screen flex items-center justify-center px-6 transition-all duration-1000 delay-500 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Animated Greeting */}
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-cyan-400 text-lg font-mono animate-pulse">
                  Hello, I'm Mukilan N.
                </span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: "0s" }}
                >
                  Y
                </span>
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                >
                  o
                </span>
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                >
                  u
                </span>
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                >
                  r
                </span>
                <span
                  className="inline-block animate-bounce mx-4"
                  style={{ animationDelay: "0.4s" }}
                ></span>
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                >
                  N
                </span>
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: "0.6s" }}
                >
                  a
                </span>
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: "0.7s" }}
                >
                  m
                </span>
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: "0.8s" }}
                >
                  e
                </span>
              </h1>

              <div className="text-xl lg:text-2xl text-gray-300 font-light">
                <span className="typing-animation">
                  Full Stack Developer & Creative Innovator
                </span>
              </div>
            </div>

            {/* Animated Description */}
            <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
              Crafting digital experiences that blend cutting-edge technology
              with artistic vision. I transform ideas into interactive realities
              that inspire and engage.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-6">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25">
                <span className="relative z-10">View My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-full font-semibold hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25">
                Get in Touch
              </button>
            </div>

            {/* Social Links */}
  <div className="flex space-x-6 pt-8">
    {socialLinks.map((social, index) => (
      <a
        key={social.name}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center hover:bg-opacity-20 hover:scale-110 transition-all duration-300 hover:text-cyan-400"
        style={{ animationDelay: `${index * 0.1}s` }}
        aria-label={social.name}
      >
        {social.icon}
      </a>
    ))}
  </div>
          </div>

          {/* Right Content - Profile Section */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Floating Rings */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="w-80 h-80 rounded-full border border-cyan-400 opacity-30"></div>
              </div>
              <div className="absolute inset-4 animate-spin-reverse">
                <div className="w-72 h-72 rounded-full border border-purple-400 opacity-30"></div>
              </div>
              <div className="absolute inset-8 animate-pulse">
                <div className="w-64 h-64 rounded-full border border-pink-400 opacity-30"></div>
              </div>

              {/* Profile Picture Container */}
              <div className="relative z-10 w-64 h-64 mx-auto">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-1 group-hover:scale-105 transition-all duration-500">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                    {/* Replace this div with your actual image */}

                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full animate-bounce"></div>
                <div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute top-1/2 -left-8 w-4 h-4 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-1000 delay-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="flex flex-col items-center space-y-2 text-gray-400">
          <span className="text-sm font-mono">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full animate-bounce mt-2"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .typing-animation {
          border-right: 2px solid #64ffda;
          animation: typing 3s steps(40) infinite, blink 1s infinite;
        }

        @keyframes typing {
          0%,
          50% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes blink {
          0%,
          50% {
            border-color: transparent;
          }
          51%,
          100% {
            border-color: #64ffda;
          }
        }

        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }

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
            transform: translateY(-20px) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(-40px) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(-20px) translateX(15px) rotate(270deg);
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

export default Home;
