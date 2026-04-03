import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookMarked, PlusCircle, BookOpen } from 'lucide-react';

export default function Curriculum() {
  const [formData, setFormData] = useState({ subjectName: '', chapterNumber: '', chapterName: '' });
  const [curriculumList, setCurriculumList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const fetchCurriculum = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/faculty/curriculum`, { headers: { Authorization: `Bearer ${token}` } });
      setCurriculumList(res.data);
    } catch (err) { console.error("Failed to fetch curriculum"); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/faculty/curriculum`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setStatus({ type: 'success', message: 'Chapter added successfully!' });
      setFormData({ ...formData, chapterNumber: '', chapterName: '' }); // Keep subject name for easy bulk entry
      fetchCurriculum();
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to add chapter.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* DATA ENTRY FORM */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center"><BookMarked className="mr-2 text-indigo-600"/> Add to Syllabus</h2>
        
        {status.message && (
          <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
            <input type="text" name="subjectName" value={formData.subjectName} onChange={handleChange} required placeholder="e.g. Data Structures" className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Chapter Number</label>
            <input type="text" name="chapterNumber" value={formData.chapterNumber} onChange={handleChange} required placeholder="e.g. Chapter 1" className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Chapter Name</label>
            <input type="text" name="chapterName" value={formData.chapterName} onChange={handleChange} required placeholder="e.g. Arrays & Strings" className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600" />
          </div>
          <div className="md:col-span-3">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center disabled:opacity-50">
              <PlusCircle className="mr-2" size={20}/> {loading ? 'Saving...' : 'Save Chapter'}
            </button>
          </div>
        </form>
      </div>

      {/* DISPLAY PREVIOUS ENTRIES */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><BookOpen className="mr-2 text-indigo-600"/> Uploaded Curriculum</h2>
        <div className="space-y-3">
          {curriculumList.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No chapters added yet.</p>
          ) : (
            curriculumList.map((item) => (
              <div key={item._id} className="flex justify-between items-center p-4 border border-slate-100 bg-slate-50 rounded-xl hover:shadow-sm">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{item.subjectName} • {item.chapterNumber}</span>
                  <h4 className="font-bold text-slate-800 mt-1">{item.chapterName}</h4>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}