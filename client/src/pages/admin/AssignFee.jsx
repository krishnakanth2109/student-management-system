import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard } from 'lucide-react';

export default function AssignFee() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '', academicYear: '2024-2025', semester: '1',
    tuitionFee: '', labFee: '0', libraryFee: '0', dueDate: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // 🔥 Added fallback to prevent API crashes
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = sessionStorage.getItem('token');

  // Fetch students for the dropdown
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data);
      } catch (err) {
        console.error('Failed to fetch students:', err);
      }
    };
    fetchStudents();
  }, [API_URL, token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.post(`${API_URL}/api/admin/assign-fee`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Fee successfully assigned to student!' });
      
      // Reset form but keep the Year and Semester default
      setFormData({ ...formData, tuitionFee: '', labFee: '0', libraryFee: '0', dueDate: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to assign fee.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-4xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <CreditCard className="text-indigo-600" /> Assign Fee to Student
      </h2>

      {status.message && (
        <div className={`p-4 mb-6 rounded-lg text-sm font-medium border ${status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Student</label>
          <select name="studentId" value={formData.studentId} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
            <option value="" disabled>-- Select a Student --</option>
            {students.length === 0 && <option disabled>Loading students...</option>}
            {students.map(student => (
              <option key={student._id} value={student._id}>
                {student.firstName} {student.lastName} ({student.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
          <input type="text" name="academicYear" value={formData.academicYear} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
          <input type="text" name="semester" value={formData.semester} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tuition Fee ($)</label>
          <input type="number" name="tuitionFee" value={formData.tuitionFee} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
          <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600" />
        </div>

        <div className="md:col-span-2 mt-4">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all">
            {loading ? 'Assigning...' : 'Assign Fee'}
          </button>
        </div>
      </form>
    </div>
  );
}