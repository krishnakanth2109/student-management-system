import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';

export default function StudentOverview() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/faculty/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data);
      } catch (err) {
        setError('Failed to load class roster. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [API_URL]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <Users className="mr-2 text-indigo-600" /> Class Roster
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Student ID</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Course</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-400">Loading roster...</td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-400">No students found.</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="p-4 font-mono text-sm text-slate-500">
                    {student._id.substring(18)}
                  </td>
                  <td className="p-4 text-slate-600 text-sm">
                    {student.email}
                  </td>
                  <td className="p-4 text-indigo-600 font-medium text-sm">
                    {student.course}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}