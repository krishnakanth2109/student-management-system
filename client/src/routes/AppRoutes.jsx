import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';
import Register from '../pages/Register';
// Layout & Auth
import Login from '../pages/Login';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import AssignFee from '../pages/admin/AssignFee';
// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AddStudent from '../pages/admin/AddStudent';
import AddFaculty from '../pages/admin/AddFaculty';
import DocumentManagement from '../pages/admin/DocumentManagement';

// Faculty Pages
import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import AddStudentToClass from '../pages/faculty/AddStudentToClass';
import StudentOverview from '../pages/faculty/StudentOverview';
import Curriculum from '../pages/faculty/Curriculum';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import DocumentCenter from '../pages/student/DocumentCenter';
import FeesPayment from '../pages/student/FeesPayment';
import FacultyDetails from '../pages/student/FacultyDetails';
import StudentCurriculum from '../pages/student/StudentCurriculum';
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />  {/* <--- Added this line */}
      {/* ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin" element={<DashboardLayout role={ROLES.ADMIN} />}>
          <Route index element={<AdminDashboard />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="add-faculty" element={<AddFaculty />} />
          <Route path="documents" element={<DocumentManagement />} />
               <Route path="assign-fee" element={<AssignFee />} /> 
          
        </Route>
      </Route>

      {/* FACULTY ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.FACULTY]} />}>
        <Route path="/faculty" element={<DashboardLayout role={ROLES.FACULTY} />}>
          <Route index element={<FacultyDashboard />} />
          <Route path="add-students" element={<AddStudentToClass />} />
          <Route path="overview" element={<StudentOverview />} />
          <Route path="curriculum" element={<Curriculum />} />
        </Route>
      </Route>

      {/* STUDENT ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
        <Route path="/student" element={<DashboardLayout role={ROLES.STUDENT} />}>
          <Route index element={<StudentDashboard />} />
          <Route path="documents" element={<DocumentCenter />} />
          <Route path="fees" element={<FeesPayment />} />
          <Route path="faculty-info" element={<FacultyDetails />} />
          <Route path="curriculum" element={<StudentCurriculum />} />
        </Route>
      </Route>

      {/* Fallback Catch-All Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}