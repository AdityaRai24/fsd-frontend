"use client";
import React, { useState, useEffect } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import RubricsPDF from "./RubricsPDF";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

const StudentRubricsModal = ({
  isOpen,
  onClose,
  student,
  subjectName,
  experimentNo,
}) => {
  const [activeTab, setActiveTab] = useState("view");

  const subjectCriterias = useStore((state) => state.subjectCriterias);

  const subjectExists = subjectCriterias.some(
    (subject) => subject.subjectId === subjectName
  );

  useEffect(() => {
    if (!subjectExists && isOpen) {
      toast.error("No rubrics found for this subject");
    }
  }, [subjectExists, isOpen]);
  

  if (!student || !subjectExists) return null;

  const subjec = subjectCriterias.find(
    (subject) => subject.subjectId === subjectName
  );

  const subjectFinalCriteria = subjec.subjectCriteria;
  const subjectFinalCO = subjec.courseOutcomes;

    let downloadAvailable = false;

  if (student?.allExperimentMarks) {
    downloadAvailable = student.allExperimentMarks.every((experiment) => {
      const sum = experiment.reduce((total, mark) => total + mark, 0);
      return sum > 0;
    });
  }

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            Rubrics Assessment for {student.studentName} ({student.rollNo})
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="view"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="view" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                View
              </TabsTrigger>
              <TabsTrigger
                value="download"
                className="flex items-center gap-1"
                disabled={!downloadAvailable}
              >
                <Download className="h-4 w-4" />
                Download
              </TabsTrigger>
            </TabsList>

            {activeTab === "download" && downloadAvailable && (
              <PDFDownloadLink
                document={
                  <RubricsPDF
                    finalCO={subjectFinalCO}
                    finalCriterias={subjectFinalCriteria}
                    subjectName={subjectName}
                    experimentNo={experimentNo}
                    studentData={student}
                  />
                }
                fileName={`rubrics-${student.rollNo}-${student.studentName
                  .replace(/\s+/g, "-")
                  .toLowerCase()}.pdf`}
              >
                {({ loading, error }) => (
                  <Button variant="outline" disabled={loading}>
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? "Preparing PDF..." : "Download PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>

          <TabsContent value="view" className="mt-2">
            <div className="h-[70vh]">
              <PDFViewer
                width="100%"
                height="100%"
                showToolbar={false}
                className="border-0"
              >
                <RubricsPDF
                  finalCO={subjectFinalCO}
                  finalCriterias={subjectFinalCriteria}
                  subjectName={subjectName}
                  experimentNo={experimentNo}
                  studentData={student}
                />
              </PDFViewer>
            </div>
          </TabsContent>

          <TabsContent value="download" className="mt-2">
            <div className="h-[70vh] flex flex-col justify-center items-center">
              {downloadAvailable ? (
                <div className="text-center">
                  <div className="mb-6">
                    <FileText className="h-16 w-16 mx-auto text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    Ready to Download
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Click the download button above to save the PDF file to your
                    device.
                  </p>
                  <PDFDownloadLink
                    document={
                      <RubricsPDF
                        finalCO={subjectFinalCO}
                        finalCriterias={subjectFinalCriteria}
                        subjectName={subjectName}
                        experimentNo={experimentNo}
                        studentData={student}
                      />
                    }
                    fileName={`rubrics-${student.rollNo}-${student.studentName
                      .replace(/\s+/g, "-")
                      .toLowerCase()}.pdf`}
                  >
                    {({ loading }) => (
                      <Button size="lg" disabled={loading}>
                        <Download className="h-4 w-4 mr-2" />
                        {loading ? "Preparing PDF..." : "Download PDF"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <FileText className="h-16 w-16 mx-auto text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    Download Unavailable
                  </h3>
                  <p className="text-gray-500">
                    All experiments must have valid marks before downloading the
                    rubrics.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StudentRubricsModal;
