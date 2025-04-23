"use client";
import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import RubricsPDF from "./RubricsPDF";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

const StudentRubricsModal = ({ isOpen, onClose, student, subjectName }) => {
  if (!student) return null;

  const subjectCriterias = useStore((state) => state.subjectCriterias);
  const subjectExists = subjectCriterias.some(
    (subject) => subject.subjectId === subjectName
  );

  let subjectFinalCriteria = null;
  let subjectFinalCO = null;

  if (subjectExists) {
    const subjec = subjectCriterias.find(
      (subject) => subject.subjectId === subjectName
    );
    subjectFinalCriteria = subjec.subjectCriteria;
    subjectFinalCO = subjec.courseOutcomes;
  } else {
    return toast.error("No rubrics found for this subject");
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            Rubrics Assessment for {student.studentName} ({student.rollNo})
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 h-[70vh]">
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
              studentData={student}
            />
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentRubricsModal;
