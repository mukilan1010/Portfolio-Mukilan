import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch experiences on mount
   useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate('/'); // redirect to login page
    } else {
      fetchExperiences(token);
    }
  }, []);

   const fetchExperiences = async (token) => {
    try {
      const res = await axios.get('https://portfolio-mukilan-2.onrender.com/api/experiences', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExperiences(res.data);
    } catch (error) {
      console.error('Failed to fetch experiences', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate('/');
      }
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company.trim() || !formData.role.trim()) {
      alert('Company and Role are required');
      return;
    }

    try {
      if (editingId) {
        // Update experience
        const res = await axios.put(`https://portfolio-mukilan-2.onrender.com/api/experiences/${editingId}`, formData);
        setExperiences(experiences.map(exp => (exp._id === editingId ? res.data : exp)));
      } else {
        // Add new experience
        const res = await axios.post('https://portfolio-mukilan-2.onrender.com/api/experiences', formData);
        setExperiences([...experiences, res.data]);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save experience', error);
    }
  };

  const handleEditClick = (experience) => {
    setEditingId(experience._id);
    setFormData({
      company: experience.company || '',
      role: experience.role || '',
      startDate: experience.startDate ? experience.startDate.slice(0, 10) : '',
      endDate: experience.endDate ? experience.endDate.slice(0, 10) : '',
      description: experience.description || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    try {
      await axios.delete(`https://portfolio-mukilan-2.onrender.com/api/experiences/${id}`);
      setExperiences(experiences.filter(exp => exp._id !== id));
    } catch (error) {
      console.error('Failed to delete experience', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Manage Experience</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Role / Position"
          value={formData.role}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
          required
        />
        <div className="flex gap-4">
          <div className="flex-grow">
            <label className="block mb-1 font-semibold">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
            />
          </div>
          <div className="flex-grow">
            <label className="block mb-1 font-semibold">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
            />
          </div>
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? 'Update Experience' : 'Add Experience'}
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
        {experiences.map((exp) => (
          <li key={exp._id} className="border-b py-4 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{exp.role} at {exp.company}</h3>
              <p className="text-sm text-gray-600">
                {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'N/A'} -{' '}
                {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
              </p>
              <p className="mt-2">{exp.description}</p>
            </div>
            <div>
              <button
                onClick={() => handleEditClick(exp)}
                className="text-green-600 hover:underline mr-3"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(exp._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExperienceManager;
