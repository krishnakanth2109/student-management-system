import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, BookMarked, Calendar, CheckCircle, 
  Activity, Clock, TrendingUp 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

export default function FacultyDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/faculty/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch faculty stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [API_URL, token]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  // Fallback data for the chart if empty
  const chartData = stats?.chaptersBySubject?.length 
    ? stats.chaptersBySubject 
    : [{ subject: 'No Data', chapters: 0 }];

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Activity className="text-indigo-600" /> Faculty Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your classes, students, and curriculum</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold flex items-center gap-2 border border-indigo-100 shadow-inner">
          <Calendar className="w-4 h-4" /> Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* TOP METRICS (TRADING STYLE CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-slate-400 font-medium text-sm mb-1">Total Students</p>
              <h3 className="text-4xl font-black text-white tracking-tight">{stats?.totalStudents || 0}</h3>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 w-fit px-2 py-1 rounded-md">
            <TrendingUp size={12} className="mr-1" /> Active Roster
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-slate-400 font-medium text-sm mb-1">Curriculum Uploaded</p>
              <h3 className="text-4xl font-black text-white tracking-tight">{stats?.totalChaptersUploaded || 0}</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <BookMarked className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 w-fit px-2 py-1 rounded-md">
            <CheckCircle size={12} className="mr-1" /> Chapters Complete
          </div>
        </div>

        {/* Metric 3 (Static for Demo, easily dynamic later) */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-slate-400 font-medium text-sm mb-1">Upcoming Classes</p>
              <h3 className="text-4xl font-black text-white tracking-tight">2</h3>
            </div>
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-orange-400 bg-orange-400/10 w-fit px-2 py-1 rounded-md">
            Starts in 45 mins
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: CHART & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART: Syllabus Progress */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Syllabus Progress Tracker</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorChapters" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }} 
                  itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="chapters" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorChapters)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ACTIVITY: Recently Uploaded Syllabus */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BookMarked className="text-indigo-600" /> Recent Syllabus Updates
          </h2>
          <div className="space-y-4">
            {stats?.recentActivity?.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-10">No chapters added yet. Start building your curriculum!</p>
            ) : (
              stats?.recentActivity?.map((act, i) => (
                <div key={i} className="flex items-start p-4 hover:bg-slate-50 rounded-xl transition-colors border border-slate-100 group relative overflow-hidden">
                  {/* Left Accent Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {act.chapterName}
                    </h4>
                    <p className="text-xs font-semibold text-indigo-500 mt-1 uppercase tracking-wider">{act.subjectName}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2">
                      {new Date(act.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}