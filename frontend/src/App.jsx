import { useState } from 'react'

import './App.css'

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SkillsManager from './components/SkillsManager';
import ProjectManager from './components/ProjectManager';
import ExperienceManager from './components/ExperienceManager';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects'
import About from './components/About';
import ContactForm from './components/ContactForm';
import CallRequest from './components/CallRequest';

import Home from './pages/Home';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';


// Components
import Navbar from './components/Navbar';

// Note: Experience, Skills, Projects components will be used inside Home page

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skillsman" element={<SkillsManager />} />
        <Route path="/projectsman" element={<ProjectManager />} />
         <Route path="/exprienceman" element={<ExperienceManager />} />
         <Route path="/skills" element={<Skills />} />
         <Route path="/exprience" element={<Experience />} />
         <Route path="/projects" element={<Projects />} />
         <Route path="/about" element={<About />} />
         <Route path="/contact" element={<ContactForm />} />
         <Route path="/call" element={<CallRequest />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
