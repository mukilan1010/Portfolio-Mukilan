import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"; // import for redirect

const SkillsManager = () => {

    const navigate = useNavigate(); // hook for navigation
  
  const [skillCategories, setSkillCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  
  // Category form
  const [newCategory, setNewCategory] = useState({
    category: '',
    icon: '🎨'
  });
  
  // Skill form
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 50,
    color: 'bg-blue-500'
  });
  
  // Editing states
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editCategoryData, setEditCategoryData] = useState({});
  const [editSkillData, setEditSkillData] = useState({});

  // Available colors for skills
  const availableColors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
    'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-gray-500', 'bg-cyan-500', 'bg-lime-500'
  ];

  // Available icons for categories
  const availableIcons = ['🎨', '⚙️', '☁️', '🛠️', '📱', '🖥️', '🌐', '🔧', '💻', '🚀'];

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/"); // redirect to login if no token
      return;
    }

    fetchSkills();
  }, [navigate]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/skills');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setSkillCategories(data);
    } catch (error) {
      setError('Failed to fetch skills');
      console.error('Failed to fetch skills', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.category.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newCategory.category,
          icon: newCategory.icon,
          skills: []
        })
      });
      if (!response.ok) throw new Error('Failed to add category');
      const data = await response.json();
      setSkillCategories([...skillCategories, data]);
      setNewCategory({ category: '', icon: '🎨' });
      setShowAddCategory(false);
    } catch (error) {
      console.error('Failed to add category', error);
    }
  };

  // Add new skill to category
  const handleAddSkill = async () => {
    if (!newSkill.name.trim() || !selectedCategoryId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/skills/${selectedCategoryId}/skill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSkill.name,
          level: parseInt(newSkill.level),
          color: newSkill.color
        })
      });
      if (!response.ok) throw new Error('Failed to add skill');
      const data = await response.json();
      
      setSkillCategories(skillCategories.map(cat => 
        cat._id === selectedCategoryId ? data : cat
      ));
      
      setNewSkill({ name: '', level: 50, color: 'bg-blue-500' });
      setSelectedCategoryId('');
      setShowAddSkill(false);
    } catch (error) {
      console.error('Failed to add skill', error);
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this entire category and all its skills?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/skills/${categoryId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete category');
      setSkillCategories(skillCategories.filter(cat => cat._id !== categoryId));
    } catch (error) {
      console.error('Failed to delete category', error);
    }
  };

  // Delete skill
  const handleDeleteSkill = async (categoryId, skillIndex) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/skills/${categoryId}/skill/${skillIndex}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete skill');
      const data = await response.json();
      setSkillCategories(skillCategories.map(cat => 
        cat._id === categoryId ? data : cat
      ));
    } catch (error) {
      console.error('Failed to delete skill', error);
    }
  };

  // Edit category
  const handleEditCategory = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/skills/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCategoryData)
      });
      if (!response.ok) throw new Error('Failed to update category');
      const data = await response.json();
      setSkillCategories(skillCategories.map(cat => 
        cat._id === categoryId ? data : cat
      ));
      setEditingCategory(null);
      setEditCategoryData({});
    } catch (error) {
      console.error('Failed to update category', error);
    }
  };

  // Edit skill
  const handleEditSkill = async (categoryId, skillIndex) => {
    try {
      const response = await fetch(`http://localhost:5000/api/skills/${categoryId}/skill/${skillIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editSkillData,
          level: parseInt(editSkillData.level)
        })
      });
      if (!response.ok) throw new Error('Failed to update skill');
      const data = await response.json();
      setSkillCategories(skillCategories.map(cat => 
        cat._id === categoryId ? data : cat
      ));
      setEditingSkill(null);
      setEditSkillData({});
    } catch (error) {
      console.error('Failed to update skill', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Skills Manager</h1>

        {/* Add Category Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {showAddCategory ? 'Cancel' : 'Add New Category'}
          </button>
        </div>

        {/* Add Category Form */}
        {showAddCategory && (
          <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Add New Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory.category}
                onChange={(e) => setNewCategory({...newCategory, category: e.target.value})}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newCategory.icon}
                onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableIcons.map(icon => (
                  <option key={icon} value={icon}>{icon} {icon}</option>
                ))}
              </select>
              <button
                onClick={handleAddCategory}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Add Category
              </button>
            </div>
          </div>
        )}

        {/* Add Skill Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddSkill(!showAddSkill)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            {showAddSkill ? 'Cancel' : 'Add New Skill'}
          </button>
        </div>

        {/* Add Skill Form */}
        {showAddSkill && (
          <div className="bg-green-50 p-6 rounded-lg mb-6 border border-green-200">
            <h3 className="text-lg font-semibold mb-4 text-green-800">Add New Skill</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Category</option>
                {skillCategories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.icon} {cat.category}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Skill name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                placeholder="Level (1-100)"
                min="1"
                max="100"
                value={newSkill.level}
                onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={newSkill.color}
                onChange={(e) => setNewSkill({...newSkill, color: e.target.value})}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {availableColors.map(color => (
                  <option key={color} value={color}>
                    {color.replace('bg-', '').replace('-500', '')}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddSkill}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Add Skill
              </button>
            </div>
          </div>
        )}

        {/* Skills Categories Display */}
        <div className="space-y-6">
          {skillCategories.map((category) => (
            <div key={category._id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
              
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                {editingCategory === category._id ? (
                  <div className="flex items-center space-x-4 flex-1">
                    <select
                      value={editCategoryData.icon || category.icon}
                      onChange={(e) => setEditCategoryData({...editCategoryData, icon: e.target.value})}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      {availableIcons.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={editCategoryData.category || category.category}
                      onChange={(e) => setEditCategoryData({...editCategoryData, category: e.target.value})}
                      className="border border-gray-300 rounded px-3 py-1 flex-1"
                    />
                    <button
                      onClick={() => handleEditCategory(category._id)}
                      className="text-green-600 font-semibold hover:text-green-800"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {setEditingCategory(null); setEditCategoryData({});}}
                      className="text-red-600 font-semibold hover:text-red-800"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{category.icon}</span>
                      <h2 className="text-xl font-bold text-gray-800">{category.category}</h2>
                      <span className="ml-3 text-sm text-gray-500">({category.skills.length} skills)</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category._id);
                          setEditCategoryData({category: category.category, icon: category.icon});
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Skills List */}
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    {editingSkill === `${category._id}-${skillIndex}` ? (
                      <div className="flex items-center space-x-4 flex-1">
                        <input
                          type="text"
                          value={editSkillData.name || skill.name}
                          onChange={(e) => setEditSkillData({...editSkillData, name: e.target.value})}
                          className="border border-gray-300 rounded px-2 py-1 flex-1"
                        />
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={editSkillData.level || skill.level}
                          onChange={(e) => setEditSkillData({...editSkillData, level: e.target.value})}
                          className="border border-gray-300 rounded px-2 py-1 w-20"
                        />
                        <select
                          value={editSkillData.color || skill.color}
                          onChange={(e) => setEditSkillData({...editSkillData, color: e.target.value})}
                          className="border border-gray-300 rounded px-2 py-1"
                        >
                          {availableColors.map(color => (
                            <option key={color} value={color}>
                              {color.replace('bg-', '').replace('-500', '')}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleEditSkill(category._id, skillIndex)}
                          className="text-green-600 font-semibold hover:text-green-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {setEditingSkill(null); setEditSkillData({});}}
                          className="text-red-600 font-semibold hover:text-red-800"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center flex-1">
                          <span className="font-medium text-gray-700 mr-4">{skill.name}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 ${skill.color} rounded-full`}
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-600">{skill.level}%</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingSkill(`${category._id}-${skillIndex}`);
                              setEditSkillData({name: skill.name, level: skill.level, color: skill.color});
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(category._id, skillIndex)}
                            className="text-red-600 hover:text-red-800 font-semibold text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                {category.skills.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No skills in this category yet. Add some skills above!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {skillCategories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">No skill categories yet</h3>
            <p>Start by adding your first skill category above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsManager;