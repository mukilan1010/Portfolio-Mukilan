import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const ProjectManager = () => {
  const navigate=useNavigate();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description1: '',
    description2: '',
    description3: '',
    description4: '',
    deploymentLink: '',
    githubLink: '',
  });
  const [screenshot, setScreenshot] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);


  // Fetch projects on mount
    useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/"); // redirect to login if no token
      return;
    }

    // Fetch projects with token auth header if needed
    const fetchProjects = async () => {
      try {
        const res = await axios.get("https://portfolio-mukilan-2.onrender.com/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);



  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle screenshot file selection
  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description1: '',
      description2: '',
      description3: '',
      description4: '',
      deploymentLink: '',
      githubLink: '',
    });
    setScreenshot(null);
    setEditingId(null);
  };

  // Add or update project
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Project title is required');
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));
      if (screenshot) data.append('screenshot', screenshot);

      if (editingId) {
        // update existing
        const res = await axios.put(`https://portfolio-mukilan-2.onrender.com/api/projects/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProjects(projects.map(p => (p._id === editingId ? res.data : p)));
      } else {
        // create new
        const res = await axios.post('https://portfolio-mukilan-2.onrender.com/api/projects', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProjects([...projects, res.data]);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save project', error);
    }
  };

  // Edit project
  const handleEditClick = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title || '',
      description1: project.description1 || '',
      description2: project.description2 || '',
      description3: project.description3 || '',
      description4: project.description4 || '',
      deploymentLink: project.deploymentLink || '',
      githubLink: project.githubLink || '',
    });
    setScreenshot(null);
  };

  // Delete project
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await axios.delete(`https://portfolio-mukilan-2.onrender.com/api/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) {
      console.error('Failed to delete project', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Manage Projects</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
          required
        />
        <input
          type="text"
          name="description1"
          placeholder="Description 1"
          value={formData.description1}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
        />
        <input
          type="text"
          name="description2"
          placeholder="Description 2"
          value={formData.description2}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
        />
        <input
          type="text"
          name="description3"
          placeholder="Description 3"
          value={formData.description3}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
        />
        <input
          type="text"
          name="description4"
          placeholder="Description 4"
          value={formData.description4}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
        />
        <input
          type="url"
          name="deploymentLink"
          placeholder="Deployment Link"
          value={formData.deploymentLink}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
        />
        <input
          type="url"
          name="githubLink"
          placeholder="GitHub Link"
          value={formData.githubLink}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
        />
        <div>
          <label className="block mb-1 font-semibold">Screenshot of the project:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? 'Update Project' : 'Add Project'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        )}
      </form>

      <ul>
        {projects.map((project) => (
          <li key={project._id} className="border-b py-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p>{project.description1}</p>
              <p>{project.description2}</p>
              <p>{project.description3}</p>
              <p>{project.description4}</p>
              <a
                href={project.deploymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mr-4"
              >
                Live Demo
              </a>
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub
              </a>
            </div>
            <div className="flex flex-col items-end">
              {project.screenshotUrl && (
  <img
    src={`https://portfolio-mukilan-2.onrender.com/${project.screenshotUrl}`}
    alt={`${project.title} screenshot`}
    className="w-32 h-20 object-cover rounded mb-2"
  />
)}

              <div>
                <button
                  onClick={() => handleEditClick(project)}
                  className="text-green-600 hover:underline mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectManager;
