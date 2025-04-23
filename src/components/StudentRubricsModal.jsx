import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import RubricsPDF from './RubricsPDF';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';


const StudentRubricsModal = ({ isOpen, onClose, student,subjectName }) => {
  if (!student) return null;

  console.log("openinnngnnng rubbrics")

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            Rubrics Assessment for {student.studentName} ({student.rollNo})
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 h-[70vh]">
          <PDFViewer width="100%" height="100%" showToolbar={false} className="border-0">
            <RubricsPDF subjectName={subjectName} studentData={student} />
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentRubricsModal;