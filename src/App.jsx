import { useState } from "react";
import Login from "./Login";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import BatchForm from "./Batchform";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SubjectRubrics from "./SubjectRubrics";
import RubricsSettings from "./RubricsSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import TeacherDash from "./TeacherDash";

function App() {


  return (
    <Router>
      <Toaster position="top-center" />
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-dashboard/:subjectId"
          element={<SubjectRubrics />}
        />
        <Route path="/teacher-dashboard/createBatch" element={<BatchForm />} />
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-dash"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDash />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/rubrics-settings/:subjectId"
          element={<RubricsSettings />}
        />
      </Routes>
    </Router>
  );
}

export default App;
