import React from 'react';
import { Users, UserCheck, FileText, Send, Mail, CheckCircle } from 'lucide-react';

export const AdminDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: 'Total Students', value: '2,845', icon: <Users className="text-blue-500" />, bg: 'bg-blue-50' },
        { title: 'Total Faculty', value: '142', icon: <UserCheck className="text-emerald-500" />, bg: 'bg-emerald-50' },
        { title: 'Pending Documents', value: '45', icon: <FileText className="text-orange-500" />, bg: 'bg-orange-50' },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className={`p-4 rounded-full ${stat.bg}`}>{stat.icon}</div>
          <div>
            <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-slate-700">New student registration approved</p>
              <p className="text-xs text-slate-400">2 hours ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const AddStudent = () => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 max-w-4xl">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">Register New Student</h2>
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div><label className="block text-sm font-medium text-slate-700 mb-1">First Name</label><input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="John" /></div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label><input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Doe" /></div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label><input type="email" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="john.doe@college.edu" /></div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
        <select className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
          <option>B.Tech Computer Science</option>
          <option>B.Tech Electronics</option>
          <option>BBA</option>
        </select>
      </div>
      <div className="md:col-span-2 mt-4">
        <button type="button" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors w-full md:w-auto">Register Student</button>
      </div>
    </form>
  </div>
);

export const AddFaculty = () => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 max-w-4xl">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">Onboard New Faculty</h2>
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label><input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Dr. Sarah Smith" /></div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
        <select className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
          <option>Computer Science</option>
          <option>Mathematics</option>
          <option>Physics</option>
        </select>
      </div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input type="email" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="faculty@college.edu" /></div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)</label><input type="number" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="5" /></div>
      <div className="md:col-span-2 mt-4">
        <button type="button" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors w-full md:w-auto">Add Faculty</button>
      </div>
    </form>
  </div>
);

export const DocumentManagement = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-slate-800">Hall Tickets & Documents</h2>
      <button className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-indigo-200">
        <Send size={18} /> <span>Bulk Send Tickets</span>
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
            <th className="p-4 font-medium rounded-tl-lg">Student ID</th>
            <th className="p-4 font-medium">Name</th>
            <th className="p-4 font-medium">Course</th>
            <th className="p-4 font-medium">Clearance Status</th>
            <th className="p-4 font-medium text-right rounded-tr-lg">Action</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4].map((i) => (
            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="p-4 text-sm font-medium text-slate-700">STU-2023-{i}04</td>
              <td className="p-4 text-sm text-slate-600">Alex Johnson</td>
              <td className="p-4 text-sm text-slate-600">B.Tech CS</td>
              <td className="p-4">
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${i % 2 === 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {i % 2 === 0 ? 'Pending Dues' : 'Cleared'}
                </span>
              </td>
              <td className="p-4 text-right">
                <button disabled={i % 2 === 0} className="text-sm bg-indigo-600 disabled:bg-slate-300 text-white px-3 py-1.5 rounded-md flex items-center space-x-1 ml-auto hover:bg-indigo-700 transition-colors">
                  <Mail size={16} /> <span>Send Ticket</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);