import React from 'react';
import { GraduationCap, Clock } from 'lucide-react';

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Alex!</h2>
        <p className="text-indigo-100">B.Tech Computer Science • Semester 4</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center space-x-4"><div className="p-4 bg-emerald-50 rounded-full"><GraduationCap className="text-emerald-500 w-6 h-6" /></div><div><p className="text-sm text-slate-500">Current CGPA</p><h3 className="text-2xl font-bold">3.84</h3></div></div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center space-x-4"><div className="p-4 bg-blue-50 rounded-full"><Clock className="text-blue-500 w-6 h-6" /></div><div><p className="text-sm text-slate-500">Attendance</p><h3 className="text-2xl font-bold">92%</h3></div></div>
      </div>
    </div>
  );
}