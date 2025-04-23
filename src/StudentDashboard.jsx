import React, { useEffect, useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import RubricsPDF from "./components/RubricsPDF";
import { Download, BookOpen, User, Calendar, School, ChevronRight, LogOut } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

function StudentDashboard() {
  const [viewMode, setViewMode] = useState("preview");
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    const sapId = localStorage.getItem("sapId");
    const token = localStorage.getItem("token");
    console.log("sending");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/students/${sapId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBatches(response.data.batches[0].subjects);
      localStorage.setItem("studentData", JSON.stringify(response.data));
      setStudentData(response.data);
    } catch (err) {
      console.log(err);
      console.log(err.response?.data.message);
      // setError(err.response?.data?.message || "Failed to fetch teacher data");
    } finally {
      setLoading(false);
    }
  };

  // Get initials from subject name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate a random color based on the subject name
  const getColorClass = (name) => {
    const colors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-red-600",
      "bg-yellow-600",
      "bg-pink-600",
      "bg-indigo-600",
      "bg-teal-600",
    ];

    // Use the sum of character codes to select a color
    const sum = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="px-6 py-8">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-medium text-gray-900">
                Welcome, {studentData?.studentName?.split(' ')[0] || "Student"}
              </h1>
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-gray-600">
                  <User size={18} className="mr-2" />
                  <span className="text-sm">SAP ID: {studentData?.sapId}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <School size={18} className="mr-2" />
                  <span className="text-sm">Roll No: {studentData?.rollNo}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches.map((subject, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/student-dashboard/${subject._id}`)}
                  className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClass(
                          subject.name
                        )} text-white text-lg font-medium`}
                      >
                        {getInitials(subject.name)}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-gray-500">{subject.code || "No code"}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        {/* <User size={16} className="mr-2" /> */}
                        {/* <span>{subject.teacher?.name || "Instructor not assigned"}</span> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {batches.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Subjects Found</h3>
                <p className="text-gray-600">
                  Contact your administrator to enroll in subjects.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
