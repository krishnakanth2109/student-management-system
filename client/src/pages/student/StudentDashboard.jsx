import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  GraduationCap, Clock, FileText, CreditCard, 
  BookOpen, Sparkles, TrendingUp 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

export default function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/student/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch student stats', err);
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

  const chartData = stats?.curriculumData?.length 
    ? stats.curriculumData 
    : [{ subject: 'No Data', chapters: 0 }];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* WELCOME BANNER (Glassmorphism & Gradient) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 group">
        {/* Animated Background Blobs */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-amber-400 w-6 h-6 animate-pulse" />
            <span className="text-indigo-200 font-bold tracking-widest text-sm uppercase">Student Portal</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{stats?.student?.firstName || 'Student'}!</span>
          </h2>
          <div className="flex items-center gap-4 text-indigo-100 font-medium">
            <span className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
              {stats?.student?.course || 'Unassigned Course'}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 flex items-center gap-2">
              <Clock size={16} /> Semester 4
            </span>
          </div>
        </div>
      </div>

      {/* METRICS GRID (Trading Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-bold text-sm mb-1">Current CGPA</p>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight">3.84</h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <GraduationCap className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">
              <TrendingUp size={12} className="mr-1" /> Top 10%
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/10 rounded-bl-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-bold text-sm mb-1">Pending Fees</p>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight">${stats?.pendingFees || 0}</h3>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                <CreditCard className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-rose-600 bg-rose-50 w-fit px-2 py-1 rounded-md border border-rose-100">
              {stats?.pendingFees > 0 ? 'Action Required' : 'Fully Paid'}
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-bold text-sm mb-1">Uploaded Docs</p>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight">{stats?.totalDocs || 0}</h3>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 w-fit px-2 py-1 rounded-md">
              Securely Stored
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: CHART & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART: Syllabus Content */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="text-indigo-400" /> Syllabus Composition
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStudent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: 'none', color: '#1e293b', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    itemStyle={{ color: '#4f46e5' }}
                  />
                  <Area type="monotone" dataKey="chapters" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill="url(#colorStudent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" /> New Curriculum Added
          </h2>
          <div className="space-y-4">
            {stats?.recentActivity?.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-10 font-medium">No new chapters added recently.</p>
            ) : (
              stats?.recentActivity?.map((act, i) => (
                <div key={i} className="flex items-start p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-colors border border-slate-100 group cursor-pointer">
                  <div className="bg-white p-2 rounded-xl shadow-sm mr-3 text-indigo-600 group-hover:scale-110 transition-transform">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-900 transition-colors line-clamp-1">
                      {act.chapterName}
                    </h4>
                    <p className="text-xs font-bold text-indigo-500 mt-1 uppercase tracking-wider">{act.subjectName}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 bg-white px-2 py-0.5 rounded-full w-fit shadow-sm border border-slate-100">
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