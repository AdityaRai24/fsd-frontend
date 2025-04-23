import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTableComp from "./data-table/DataTableComp";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./sidebar/Sidebar";
import { ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useStore } from "./store/useStore";

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [editMode, setEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [experiment, setExperiment] = useState(null);
  const subject = searchParams.get("sub");
  const experimentNo = searchParams.get("exp");
  const navigate = useNavigate();

  const teacherData = useStore((state) => state.teacherData);
  const setTeacherData = useStore((state) => state.setTeacherData);
  const setSubjectCriterias = useStore((state) => state.setSubjectCriterias);

  // Check for teacherData in localStorage and update Zustand store if needed
  useEffect(() => {
    // If teacherData already exists in Zustand store, no need to check localStorage
    if (teacherData) {
      setLoading(false);
      return;
    }

    // Check for teacherData in localStorage
    const storedTeacherData = localStorage.getItem("teacherData");
    if (storedTeacherData) {
      try {
        const parsedData = JSON.parse(storedTeacherData);
        setTeacherData(parsedData);
      } catch (err) {
        setError("Failed to parse teacher data from localStorage");
      }
    } else {
      // If no data in localStorage, redirect to teacher-dash to fetch it
      navigate("/teacher-dash");
      return;
    }

    // Check and set subject criterias from localStorage
    const subjectCriterias = localStorage.getItem("subjectCriterias");
    if (subjectCriterias) {
      try {
        let parsedData = JSON.parse(subjectCriterias);
        const criteriaFinal = parsedData.find(
          (item) => item.subjectId === subject
        );
        if (criteriaFinal) {
          setSubjectCriterias(criteriaFinal);
        }
      } catch (err) {
        console.error("Failed to parse subject criterias", err);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchExperimentData();
  }, [subject, experimentNo]);

  useEffect(() => {
    if (!subject) {
      navigate("/teacher-dash");
    }
  }, [subject, experimentNo]);

  useEffect(() => {
    const redirectFirst = async () => {
      try {
        if (subject && !experimentNo) {
          const firstExperimentID = await fetchFirstExperimentId();
          console.log(firstExperimentID)
          if (firstExperimentID) {
            navigate(
              `/teacher-dashboard?exp=${firstExperimentID._id}&sub=${subject}`
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (subject && !experimentNo) {
      redirectFirst();
    }
  }, [subject, experimentNo]);

  const fetchFirstExperimentId = async () => {
    if (!subject) return;

    try {
      const token = localStorage.getItem("token");
      const allData = JSON.parse(localStorage.getItem("allData"));
      const currentBatch = allData.batches[0];

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/experiments?subject=${subject}&batch=${currentBatch._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sortedExperiments = response.data.sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)?.[0] || 0);
        const numB = parseInt(b.name.match(/\d+/)?.[0] || 0);
        return numA - numB;
      });

      return sortedExperiments[0];
    } catch (error) {
      console.error("Error fetching experiments:", error);
    }
  };

  const fetchExperimentData = async () => {
    if (!experimentNo) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/experiments/${experimentNo}`
      );
      setExperiment(response.data);
    } catch (err) {
      setError("Failed to fetch experiment data");
      console.error(err);
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

  return (
    <SidebarProvider>
      <Toaster position="top-center" />
      <AppSidebar teacher={teacherData} />
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
