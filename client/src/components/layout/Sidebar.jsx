import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROLES } from '../../constants/roles';
import { 
  LayoutDashboard, UserPlus, FileText, Send, 
  CreditCard, Users, BookOpen, GraduationCap, 
  UserCheck, LogOut, BookMarked
} from 'lucide-react';

export default function Sidebar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getLinks = () => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
          { name: 'Add Student', path: '/admin/add-student', icon: <UserPlus size={20} /> },
          { name: 'Add Faculty', path: '/admin/add-faculty', icon: <UserCheck size={20} /> },
           { name: 'Assign Fee', path: '/admin/assign-fee', icon: <CreditCard size={20} /> }, // 🔥 Add this line
          { name: 'Documents & Tickets', path: '/admin/documents', icon: <Send size={20} /> },
        ];
      case ROLES.FACULTY:
        return [
          { name: 'Dashboard', path: '/faculty', icon: <LayoutDashboard size={20} /> },
          { name: 'Enroll Students', path: '/faculty/add-students', icon: <UserPlus size={20} /> },
          { name: 'Student Overview', path: '/faculty/overview', icon: <Users size={20} /> },
          { name: 'My Curriculum', path: '/faculty/curriculum', icon: <BookMarked size={20} /> },
        ];
      case ROLES.STUDENT:
        return [
          { name: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> },
          { name: 'Docs & Hall Tickets', path: '/student/documents', icon: <FileText size={20} /> },
          { name: 'Fees Payment', path: '/student/fees', icon: <CreditCard size={20} /> },
            { name: 'Course Syllabus', path: '/student/curriculum', icon: <BookMarked size={20} /> }, // 🔥 ADDED HERE
          { name: 'Faculty Details', path: '/student/faculty-info', icon: <GraduationCap size={20} /> },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <BookOpen className="w-8 h-8 text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold">EduManage</h2>
          <span className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">{role}</span>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {getLinks().map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path.split('/').length === 2}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={handleLogout} className="flex items-center space-x-3 text-slate-400 hover:text-red-400 transition-colors w-full px-4 py-2">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}