import React from 'react';
import { Users } from 'lucide-react';

export default function StudentOverview() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6"><Users className="inline mr-2" /> Class Roster</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-500 border-b"><th className="p-4">Name</th><th className="p-4">ID</th><th className="p-4">Grade</th></tr>
        </thead>
        <tbody>
          <tr className="border-b"><td className="p-4">Emma Watson</td><td className="p-4">STU-1001</td><td className="p-4 font-bold text-indigo-600">A</td></tr>
          <tr className="border-b"><td className="p-4">Tony Stark</td><td className="p-4">STU-1002</td><td className="p-4 font-bold text-indigo-600">B+</td></tr>
        </tbody>
      </table>
    </div>
  );
}