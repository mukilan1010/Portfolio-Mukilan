import React from 'react';
import { Link,useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate=useNavigate();
  return (
    <nav className="bg-black text-white py-4 px-6 shadow-md flex justify-between items-center">
   
       <Link to="/" className="text-2xl font-bold">Mukilan N</Link>

     
      <ul className="flex space-x-6">
        <li>
          <Link to="/" className="hover:text-gray-400 transition-colors">Home</Link>
        </li>
        <li>
          <Link to="/skills" className="hover:text-gray-400 transition-colors">Skills</Link>
        </li>
        <li>
          <Link to="/exprience" className="hover:text-gray-400 transition-colors">Experience</Link>
        </li>
        <li>
          <Link to="/projects" className="hover:text-gray-400 transition-colors">Projects</Link>
        </li>
       
        <li>
          <Link to="/about" className="hover:text-gray-400 transition-colors">About</Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
