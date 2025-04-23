import React, { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import RubricsPDF from "./RubricsPDF";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const StudentRubricsModal = ({ isOpen, onClose, student, subjectName }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const generatePdf = async () => {
      if (!student) return;
      const blob = await pdf(
        <RubricsPDF subjectName={subjectName} studentData={student} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    };

    if (isOpen) {
      generatePdf();
    }

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    };
  }, [isOpen, student, subjectName]);

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            Rubrics Assessment for {student.studentName} ({student.rollNo})
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 h-[70vh]">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Rubrics PDF"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Generating PDF...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentRubricsModal;
