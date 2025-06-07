import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // import for redirect

const CallRequest = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // hook for navigation

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/"); // redirect to login if no token
      return;
    }

    const fetchContacts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/contacts", {
          headers: { Authorization: `Bearer ${token}` }, // if backend requires auth header
        });
        if (res.data.success) {
          setContacts(res.data.data);
        } else {
          setError("Failed to fetch contacts.");
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError("Error fetching contacts.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Contact Requests</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : contacts.length === 0 ? (
        <p className="text-gray-400">No contact requests found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="p-4 border border-cyan-400 rounded-xl bg-slate-800 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-cyan-300">{contact.name}</h2>
              <p className="text-sm text-gray-400">{new Date(contact.createdAt).toLocaleString()}</p>
              <div className="mt-2 space-y-1">
                <p><span className="font-medium">Email:</span> {contact.email}</p>
                <p><span className="font-medium">Phone:</span> {contact.phone}</p>
                <p><span className="font-medium">Message:</span> {contact.message}</p>
                <p><span className="font-medium">Status:</span> {contact.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CallRequest;
