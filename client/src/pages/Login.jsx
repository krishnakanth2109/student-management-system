import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ROLES } from '../constants/roles';
import { 
  GraduationCap, Lock, Mail, UserCircle,
  Sparkles, Shield, BookOpen, ArrowRight, CheckCircle
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState(ROLES.STUDENT);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 🔥 ADDED FALLBACK: If .env fails, it forces it to use localhost:5000
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { 
        email, 
        password, 
        role 
      }, { withCredentials: true });

      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('userRole', response.data.role);
      sessionStorage.setItem('isAuthenticated', 'true');
      
      if (response.data.role === 'ADMIN') navigate('/admin');
      else if (response.data.role === 'FACULTY') navigate('/faculty');
      else navigate('/student');
      
    } catch (err) {
      console.error("Full Login Error:", err);
      // 🔥 THIS WILL NOW SHOW THE EXACT ERROR ON SCREEN (e.g. "Network Error" or "User not found")
      const exactError = err.response?.data?.message || err.message || 'Server connection failed.';
      setError(`Error: ${exactError}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch(role) {
      case ROLES.ADMIN: return <Shield className="w-5 h-5" />;
      case ROLES.FACULTY: return <BookOpen className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getRoleGradient = () => {
    switch(role) {
      case ROLES.ADMIN: return "from-purple-600 to-indigo-600";
      case ROLES.FACULTY: return "from-blue-600 to-cyan-600";
      default: return "from-emerald-600 to-teal-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500">
          <div className="flex flex-col items-center mb-8">
            <div className={`bg-gradient-to-r ${getRoleGradient()} p-4 rounded-2xl mb-4 shadow-lg`}>
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              College Portal
            </h1>
            <p className="text-white/60 text-sm">Welcome back! Please sign in to continue</p>
          </div>

          {/* ERROR DISPLAY BOX */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-xl text-sm mb-5 text-center backdrop-blur-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <UserCircle className="w-4 h-4" /> Select Your Role
              </label>
              <div className="relative group">
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 outline-none appearance-none text-white transition-all"
                >
                  <option value={ROLES.STUDENT} className="bg-slate-800 text-white">🎓 Student</option>
                  <option value={ROLES.FACULTY} className="bg-slate-800 text-white">📚 Faculty</option>
                  <option value={ROLES.ADMIN} className="bg-slate-800 text-white">⚡ Admin</option>
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">{getRoleIcon()}</div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">▼</div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 outline-none text-white placeholder-white/40"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 outline-none text-white placeholder-white/40"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={`w-full bg-gradient-to-r ${getRoleGradient()} text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 group`}>
              {isLoading ? 'Signing in...' : <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>
        </div>
      </div>
      <style jsx="true">{`
        @keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}