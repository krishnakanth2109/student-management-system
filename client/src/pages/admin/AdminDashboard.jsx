import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserCheck, BookOpen, FileWarning, TrendingUp, Clock, Activity } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = sessionStorage.getItem('token');

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
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

  // Fallback data if DB is completely empty
  const defaultBarData = [{ name: 'No Data', students: 0 }];
  const defaultPieData = [{ name: 'No Data', value: 1 }];

  const barData = stats?.charts?.studentsByCourse?.length ? stats.charts.studentsByCourse : defaultBarData;
  const pieData = stats?.charts?.studentsByGender?.length ? stats.charts.studentsByGender : defaultPieData;

  const topCards = [
    { title: "Total Students", value: stats?.totals?.totalStudents || 0, icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", trend: "+12%" },
    { title: "Total Faculty", value: stats?.totals?.totalFaculty || 0, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", trend: "+2%" },
    { title: "Active Courses", value: stats?.totals?.totalCourses || 0, icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", trend: "Stable" },
    { title: "Pending Docs", value: stats?.totals?.pendingDocs || 0, icon: FileWarning, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", trend: "-5%" },
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Activity className="text-indigo-600" /> System Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">Live metrics and analytics for EduManage</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20 text-sm font-bold flex items-center gap-2 tracking-wide">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          LIVE SYSTEM : {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* STATS GRID (TRADING STYLE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCards.map((card, i) => (
          <div key={i} className={`bg-slate-900 rounded-2xl p-6 border ${card.border} shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
            {/* Background Glow */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 ${card.bg} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-slate-400 font-medium text-sm mb-1">{card.title}</p>
                <h3 className="text-4xl font-black text-white tracking-tight">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${card.bg} border ${card.border}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 w-fit px-2 py-1 rounded-md">
              <TrendingUp size={12} className="mr-1" /> {card.trend} this month
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BAR CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Enrollment by Course</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }} 
                />
                <Bar dataKey="students" fill="#6366f1" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Gender Demographics</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-slate-600 font-medium">{entry.name}</span>
                </div>
                <span className="font-bold text-slate-800">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY LIST */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Clock className="text-indigo-600" /> Recent Enrollments
        </h2>
        <div className="space-y-4">
          {stats?.recentActivity?.length === 0 ? (
            <p className="text-slate-500 text-sm">No recent activity.</p>
          ) : (
            stats?.recentActivity?.map((act, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors border border-slate-100 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {act.firstName.charAt(0)}{act.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {act.firstName} {act.lastName}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">{act.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {new Date(act.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}