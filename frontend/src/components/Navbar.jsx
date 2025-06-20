import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // You can also use heroicons or SVG if not using lucide

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black text-white py-4 px-6 shadow-md">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Mukilan N</Link>

        {/* Hamburger menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li><Link to="/" className="hover:text-gray-400 transition-colors">Home</Link></li>
          <li><Link to="/skills" className="hover:text-gray-400 transition-colors">Skills</Link></li>
          <li><Link to="/exprience" className="hover:text-gray-400 transition-colors">Experience</Link></li>
          <li><Link to="/projects" className="hover:text-gray-400 transition-colors">Projects</Link></li>
          <li><Link to="/about" className="hover:text-gray-400 transition-colors">About</Link></li>
          <li><Link to="/contact" className="hover:text-gray-400 transition-colors">Contact</Link></li>
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <ul className="md:hidden mt-4 space-y-4 text-center">
          <li><Link to="/" onClick={toggleMenu} className="block hover:text-gray-400">Home</Link></li>
          <li><Link to="/skills" onClick={toggleMenu} className="block hover:text-gray-400">Skills</Link></li>
          <li><Link to="/exprience" onClick={toggleMenu} className="block hover:text-gray-400">Experience</Link></li>
          <li><Link to="/projects" onClick={toggleMenu} className="block hover:text-gray-400">Projects</Link></li>
          <li><Link to="/about" onClick={toggleMenu} className="block hover:text-gray-400">About</Link></li>
          <li><Link to="/contact" onClick={toggleMenu} className="block hover:text-gray-400">Contact</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
