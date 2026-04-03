import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GraduationCap, Mail, Loader2, UserCircle } from 'lucide-react';

export default function FacultyDetails() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get API URL from .env
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/student/instructors`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInstructors(res.data);
      } catch (err) {
        console.error("Fetch Faculty Error:", err);
        setError('Unable to load instructor details.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-2 text-indigo-600" />
        <p>Loading instructors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-slate-800">My Instructors</h2>
        <p className="text-slate-500 text-sm">List of faculty members in your departments</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {instructors.length === 0 && !error ? (
        <div className="bg-white p-10 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
          <UserCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No instructors found in the system yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((faculty) => (
            <div 
              key={faculty._id} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center hover:shadow-md transition-shadow group"
            >
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100 transition-colors">
                <GraduationCap className="text-indigo-600 w-10 h-10" />
              </div>
              
              <h3 className="text-lg font-bold text-slate-800">{faculty.fullName}</h3>
              <p className="text-sm text-indigo-600 font-semibold mb-4 uppercase tracking-wider">
                {faculty.department}
              </p>
              
              <div className="pt-4 border-t border-slate-50">
                <a 
                  href={`mailto:${faculty.email}`}
                  className="w-full py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium flex justify-center items-center hover:bg-indigo-600 hover:text-white transition-all gap-2"
                >
                  <Mail size={16} />
                  <span>Contact via Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}