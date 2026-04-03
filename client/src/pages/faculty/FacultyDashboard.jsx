import React from 'react';
import { Calendar } from 'lucide-react';

export default function FacultyDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><Calendar className="mr-2 text-indigo-500" /> Today's Classes</h3>
        <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg flex items-center">
          <div className="min-w-[100px] font-bold text-indigo-900">09:00 AM</div>
          <div><h4 className="font-bold text-slate-800">CS301 - Data Structures</h4><p className="text-sm text-slate-500">Room 402 • 45 Students</p></div>
        </div>
      </div>
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold mb-4">Stats</h3>
        <p className="text-slate-400">Total Students: <span className="text-white font-bold ml-2">185</span></p>
        <p className="text-slate-400 mt-2">Assignments to Grade: <span className="text-orange-400 font-bold ml-2">24</span></p>
      </div>
    </div>
  );
}