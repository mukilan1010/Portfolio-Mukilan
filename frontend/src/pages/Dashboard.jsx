import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const navigate=useNavigate();

  useEffect(() => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/"); // redirect to login if no token
        return;
      }

    }, [navigate]); 

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Admin Dashboard</h1>

        <p className="mb-8 text-gray-700">
          Welcome to your admin panel! Here you can manage your portfolio content dynamically.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div
      className="border rounded-lg p-5 hover:shadow-lg transition cursor-pointer bg-green-50"
      onClick={() => navigate('/skillsman')}
    >
      <h2 className="text-2xl font-semibold mb-2">Manage Skills</h2>
      <p className="text-gray-600">Add, edit, or remove your skills</p>
    </div>

          <div className="border rounded-lg p-5 hover:shadow-lg transition cursor-pointer bg-green-50" onClick={() => navigate('/projectsman')}>
            <h2 className="text-2xl font-semibold mb-2">Manage Projects</h2>
            <p className="text-gray-600">Update your project portfolio</p>
          </div>

          <div className="border rounded-lg p-5 hover:shadow-lg transition cursor-pointer bg-green-50"onClick={() => navigate('/exprienceman')}>
            <h2 className="text-2xl font-semibold mb-2">Manage Experience</h2>
            <p className="text-gray-600">Edit your professional experience</p>
          </div>

          <div className="border rounded-lg p-5 hover:shadow-lg transition cursor-pointer bg-green-50" onClick={() => navigate('/call')}>
            <h2 className="text-2xl font-semibold mb-2">Manage call Requests</h2>
            <p className="text-gray-600">Update your project portfolio</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
