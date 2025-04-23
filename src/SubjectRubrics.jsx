import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import RubricsPDF from "./components/RubricsPDF";
import { Download, Eye, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const SubjectRubrics = () => {
  const params = useParams();
  const subjectId = params.subjectId;
  const userId = JSON.parse(localStorage.getItem("studentData"))._id;
  const [activeView, setActiveView] = useState("preview");
  const [rubricsData, setRubricsData] = useState(null);

  useEffect(() => {
    fetchRubricsDetails();
  }, []);

  const fetchRubricsDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/students/${subjectId}/${userId}`
      );
      const allExpMarks = [];
      response.data.experiments.map((item) => allExpMarks.push(item.marks));
      console.log(response.data)
      let newData = {
        allExperimentMarks: allExpMarks,
        rollNo: response.data.rollNo,
        studentName: response.data.studentName,
        sapId: response.data.sapId,
        subjectName: response.data.subject,
        subject: response.data.subject
      };
      console.log("Current subject data:", response.data);
      console.log("Prepared studentData for PDF:", newData);
      setRubricsData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  if (rubricsData === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading assessment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back</span>
        </button>
        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveView("preview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeView === "preview"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Eye size={18} />
            Preview
          </button>
          <button
            onClick={() => toast.error("All Experiments have not been graded yet.")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeView === "download"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Download size={18} />
            Download
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-64px)]">
        {activeView === "preview" ? (
          <PDFViewer showToolbar={false} width="100%" height="100%" className="border-0">
            <RubricsPDF studentData={rubricsData} subjectName={rubricsData.subjectName} />
          </PDFViewer>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-4">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Ready for Download
              </h3>
              <p className="text-gray-600 mb-6">
                Click below to download your assessment document
              </p>
              <PDFDownloadLink
                document={<RubricsPDF studentData={rubricsData} />}
                fileName={`${rubricsData.studentName.replace(/\s+/g, '_')}_${rubricsData.rollNo}_assessment.pdf`}
                className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors w-full"
              >
                {({ loading }) =>
                  loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Preparing...</span>
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      <span>Download PDF</span>
                    </>
                  )
                }
              </PDFDownloadLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectRubrics;
