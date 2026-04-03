import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROLES } from '../../constants/roles';
import { 
  LayoutDashboard, UserPlus, FileText, Send, 
  CreditCard, Users, BookOpen, GraduationCap, 
  UserCheck, LogOut, BookMarked, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear(); // Fixed to sessionStorage
    navigate('/login');
  };

  const getLinks = () => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
          { name: 'Add Student', path: '/admin/add-student', icon: <UserPlus size={20} /> },
          { name: 'Add Faculty', path: '/admin/add-faculty', icon: <UserCheck size={20} /> },
          { name: 'Assign Fee', path: '/admin/assign-fee', icon: <CreditCard size={20} /> },
          { name: 'Documents & Tickets', path: '/admin/documents', icon: <Send size={20} /> },
        ];
      case ROLES.FACULTY:
        return [
          { name: 'Dashboard', path: '/faculty', icon: <LayoutDashboard size={20} /> },
          // { name: 'Enroll Students', path: '/faculty/add-students', icon: <UserPlus size={20} /> },
          { name: 'Student Overview', path: '/faculty/overview', icon: <Users size={20} /> },
          { name: 'My Curriculum', path: '/faculty/curriculum', icon: <BookMarked size={20} /> },
        ];
      case ROLES.STUDENT:
        return [
          { name: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> },
          { name: 'Course Syllabus', path: '/student/curriculum', icon: <BookMarked size={20} /> },
          { name: 'Docs & Hall Tickets', path: '/student/documents', icon: <FileText size={20} /> },
          { name: 'Fees Payment', path: '/student/fees', icon: <CreditCard size={20} /> },
          { name: 'Faculty Details', path: '/student/faculty-info', icon: <GraduationCap size={20} /> },
        ];
      default:
        return [];
    }
  };

  return (
    <div 
      className={`relative flex flex-col bg-slate-950 text-slate-300 h-screen border-r border-slate-800 transition-all duration-300 ease-in-out z-20 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* COLLAPSE TOGGLE BUTTON */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-full shadow-lg border-2 border-slate-900 transition-transform duration-300 hover:scale-110 z-50"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* HEADER LOGO */}
      <div className={`p-6 flex items-center border-b border-slate-800/50 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'space-x-3'}`}>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        
        <div className={`flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
          <h2 className="text-xl font-bold text-white tracking-wide">EduManage</h2>
          <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase mt-0.5">{role}</span>
        </div>
      </div>
      
      {/* NAVIGATION LINKS */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {getLinks().map((link) => (
          <div key={link.path} className="relative group">
            <NavLink
              to={link.path}
              end={link.path.split('/').length === 2}
              className={({ isActive }) =>
                `flex items-center rounded-xl transition-all duration-200 ${
                  isCollapsed ? 'justify-center p-3' : 'px-4 py-3 space-x-3'
                } ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20 font-semibold' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                }`
              }
            >
              <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                {link.icon}
              </div>
              
              <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isCollapsed ? 'w-0 opacity-0 hidden' : 'w-full opacity-100'
              }`}>
                {link.name}
              </span>
            </NavLink>

            {/* TOOLTIP FOR COLLAPSED MODE */}
            {isCollapsed && (
              <div className="absolute left-14 top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-slate-800 text-white text-sm font-medium rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-slate-700 pointer-events-none">
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent border-r-slate-800 w-0 h-0"></div>
                {link.name}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* LOGOUT BUTTON */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="relative group">
          <button 
            onClick={handleLogout} 
            className={`w-full flex items-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 ${
              isCollapsed ? 'justify-center p-3' : 'px-4 py-3 space-x-3'
            }`}
          >
            <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
              <LogOut size={20} />
            </div>
            <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isCollapsed ? 'w-0 opacity-0 hidden' : 'w-full opacity-100 text-left'
            }`}>
              Logout
            </span>
          </button>

          {/* LOGOUT TOOLTIP */}
          {isCollapsed && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-rose-500 text-white text-sm font-medium rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent border-r-rose-500 w-0 h-0"></div>
              Logout
            </div>
          )}
        </div>
      </div>
    </div>
  );
}