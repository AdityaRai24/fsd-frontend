import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, BookOpen, ClipboardEdit, Settings } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";

const TeacherDash = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    const teacherId = localStorage.getItem("teacherId");
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:8000/api/teachers/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeacher(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch teacher data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
        <Toaster position="top-center" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <Toaster position="top-center" />
      </div>
    );
  }

  const handleStartEvaluation = () => {
    navigate(
      `/teacher-dashboard?exp=${teacher.batches[0].students[0].experiments[0].experimentId}&sub=${teacher.batches[0].subjects[0].name}`
    );
  };


  return (
    <div className="px-6 py-8">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Teacher Info */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-medium text-gray-900">
            Welcome, {teacher?.name?.split(" ")[0] || "Teacher"}
          </h1>
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-gray-600">
              <User className="h-5 w-5 mr-2" />
              <span className="text-sm">ID: {teacher?.teacherId}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Mail className="h-5 w-5 mr-2" />
              <span className="text-sm">{teacher?.email}</span>
            </div>
          </div>
        </div>

        {/* Teacher Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center">
            <div className="bg-gray-900 rounded-full p-4 h-16 w-16 flex items-center justify-center">
              <span className="text-2xl text-white">
                {teacher?.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </span>
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-medium text-gray-900">
                {teacher?.name}
              </h2>
              <p className="text-gray-500 mt-1">
                Department of Information Technology
              </p>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-all duration-200">
            <div className="text-gray-900 mb-4">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select Subject
            </h3>
            <p className="text-gray-600 text-sm">
              Choose a subject from the sidebar to begin evaluating student
              experiments
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-all duration-200">
            <div className="text-gray-900 mb-4">
              <ClipboardEdit className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Manage Marks
            </h3>
            <p className="text-gray-600 text-sm">
              Edit and update student marks for each experiment efficiently
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-all duration-200">
            <div className="text-gray-900 mb-4">
              <Settings className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Customize Rubrics
            </h3>
            <p className="text-gray-600 text-sm">
              Configure assessment criteria and rubrics for better evaluation
            </p>
          </div>
        </div>

        {/* New Batches Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Your Batches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacher.batches.map((batch) => (
              <div
                key={batch._id}
                onClick={() => navigate(`/teacher-dashboard?exp=${batch.students[0].experiments[0].experimentId}&sub=${batch.subjects[0].name}`)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium text-gray-900">{batch.name}</h3>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {batch.subjects.length} Subjects
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm">
                    Students: {batch.students.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {batch.subjects.slice(0, 3).map((subject, index) => (
                      <span
                        key={index}
                        className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md text-xs"
                      >
                        {subject.name}
                      </span>
                    ))}
                    {batch.subjects.length > 3 && (
                      <span className="text-gray-400 text-xs">
                        +{batch.subjects.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDash;
