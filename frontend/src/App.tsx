import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Layout from './components/Layout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentSubmit from './pages/student/StudentSubmit';
import StudentResults from './pages/student/StudentResults';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherStudentAnalytics from './pages/teacher/TeacherStudentAnalytics';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <Layout role="student" />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="submit" element={<StudentSubmit />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="results/:id" element={<StudentResults />} />
            <Route index element={<Navigate to="/student/dashboard" replace />} />
          </Route>

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute role="teacher">
                <Layout role="teacher" />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="student-analytics" element={<TeacherStudentAnalytics />} />
            <Route path="student-analytics/:id" element={<TeacherStudentAnalytics />} />
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
