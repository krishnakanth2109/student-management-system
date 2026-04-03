import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, GraduationCap, PlusCircle } from 'lucide-react';

export default function AddStudent() {
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', email: '', course: '', 
    phoneNumber: '', address: '', gender: 'Male' 
  });
  const [courses, setCourses] = useState([]); // Dynamic courses list
  const [studentsList, setStudentsList] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get(`${API_URL}/api/admin/students`, { headers: { Authorization: `Bearer ${token}` } });
    setStudentsList(res.data);
  };

  const fetchCourses = async () => {
    const res = await axios.get(`${API_URL}/api/admin/courses`);
    setCourses(res.data);
    if (res.data.length > 0) setFormData(prev => ({ ...prev, course: res.data[0].courseName }));
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/admin/add-student`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setStatus({ type: 'success', message: 'Student registered successfully!' });
      fetchStudents();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to add student.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <GraduationCap className="text-indigo-600" /> Student Enrollment
        </h2>

        {status.message && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-medium border ${status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><label className="text-sm font-semibold text-slate-600">First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div><label className="text-sm font-semibold text-slate-600">Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div><label className="text-sm font-semibold text-slate-600">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div><label className="text-sm font-semibold text-slate-600">Phone Number</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div><label className="text-sm font-semibold text-slate-600">Select Course</label>
            <select name="course" value={formData.course} onChange={handleChange} className="w-full mt-1 p-3 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500">
              {courses.map(c => <option key={c._id} value={c.courseName}>{c.courseName}</option>)}
              {courses.length === 0 && <option>No Courses Available</option>}
            </select>
          </div>
          <div><label className="text-sm font-semibold text-slate-600">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full mt-1 p-3 border rounded-xl bg-white outline-none">
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div className="md:col-span-3"><label className="text-sm font-semibold text-slate-600">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" rows="2"></textarea>
          </div>
          <div className="md:col-span-3">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
              <PlusCircle size={20}/> {loading ? 'Registering...' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Users className="text-indigo-600" /> Registered Students
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b">
                <th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Course</th><th className="p-4">Phone</th>
              </tr>
            </thead>
            <tbody>
              {studentsList.map(s => (
                <tr key={s._id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-semibold">{s.firstName} {s.lastName}</td>
                  <td className="p-4 text-slate-600">{s.email}</td>
                  <td className="p-4"><span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{s.course}</span></td>
                  <td className="p-4 text-slate-500">{s.phoneNumber || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}