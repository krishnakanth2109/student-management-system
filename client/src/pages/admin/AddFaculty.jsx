import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';

export default function AddFaculty() {
  const [formData, setFormData] = useState({ fullName: '', department: 'Computer Science', email: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  
  // New state to hold the list of faculty
  const [facultyList, setFacultyList] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch faculty when the page loads
  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/admin/faculty`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFacultyList(res.data);
    } catch (err) {
      console.error("Failed to fetch faculty:", err);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const token = sessionStorage.getItem('token');
      
      await axios.post(`${API_URL}/api/admin/add-faculty`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      setStatus({ type: 'success', message: 'Faculty member added successfully! Default password: password123' });
      setFormData({ fullName: '', department: 'Computer Science', email: '' }); // Reset form
      
      // Refresh the table immediately after adding
      fetchFaculty();
    } catch (err) {
      console.error("Add Faculty Error:", err);
      const exactError = err.response?.data?.message || err.message || 'Failed to add faculty.';
      setStatus({ type: 'error', message: `Error: ${exactError}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ADD FACULTY FORM */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Onboard Faculty</h2>

        {status.message && (
          <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Dr. Sarah Smith" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select name="department" value={formData.department} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="unique.faculty@college.edu" />
          </div>
          <div className="md:col-span-2 mt-4">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 w-full md:w-auto disabled:opacity-50 transition-colors">
              {loading ? 'Adding Faculty...' : 'Add Faculty'}
            </button>
          </div>
        </form>
      </div>

      {/* EXISTING FACULTY TABLE */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-4xl">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Users className="mr-2 text-indigo-600" /> Existing Faculty
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium rounded-tl-lg">Name</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium rounded-tr-lg">Email</th>
              </tr>
            </thead>
            <tbody>
              {facultyList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-slate-500">No faculty onboarded yet.</td>
                </tr>
              ) : (
                facultyList.map((faculty) => (
                  <tr key={faculty._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-800">{faculty.fullName}</td>
                    <td className="p-4 text-sm text-indigo-600 font-medium">{faculty.department}</td>
                    <td className="p-4 text-sm text-slate-600">{faculty.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}