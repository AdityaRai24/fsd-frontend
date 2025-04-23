import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTableComp from "./data-table/DataTableComp";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./sidebar/Sidebar";
import { ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [editMode, setEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [experiment, setExperiment] = useState(null);
  const [teacherSubjects, setTeacherSubjects] = useState(null);
  const subject = searchParams.get("sub");
  const experimentNo = searchParams.get("exp");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeacherData();
    fetchExperimentData();
  }, []);

  // If no subject or experiment is selected, redirect to teacher dash
  useEffect(() => {
    if (!subject && !experimentNo) {
      navigate("/teacher-dash");
    }
  }, [subject, experimentNo]);

  const fetchTeacherData = async () => {
    const teacherId = localStorage.getItem("teacherId");
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/teachers/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem("allData", JSON.stringify(response.data));
      setTeacher(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch teacher data");
    } finally {
      setLoading(false);
    }
  };

  const fetchExperimentData = async () => {
    console.log(experimentNo);
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/experiments/${experimentNo}`
    );
    setExperiment(response.data);
  };

  const fetchTeacherSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/teachers/${teacher?._id}/subjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeacherSubjects(response.data.teacher[0]);
    } catch (error) {
      console.error("Error fetching teacher subjects:", error);
      toast.error("Failed to fetch subjects");
    }
  };

  useEffect(() => {
    if (teacher?._id) {
      fetchTeacherSubjects();
    }
  }, [teacher]);

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

  return (
    <SidebarProvider>
      <Toaster position="top-center" />
      <AppSidebar teacher={teacher} />
      <SidebarTrigger
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="relative ml-16 mt-5"
      />
      <main className={`w-full mt-16`}>
        <div className="text-left mb-6 max-w-[80%] mx-auto">
          <h1 className="text-4xl font-medium uppercase">{subject}</h1>
          <div className="flex gap-2 items-center mt-2">
            <p className="text-gray-600 text-base uppercase">{subject}</p>
            <ChevronRight className="w-4 h-4" />
            <p className="text-gray-600 text-base">{experiment?.name}</p>
          </div>
        </div>
        <DataTableComp
          experimentNo={experimentNo}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      </main>
    </SidebarProvider>
  );
};

export default TeacherDashboard;
