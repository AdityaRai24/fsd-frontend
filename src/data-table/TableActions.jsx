import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import RubricsPDF from "@/components/RubricsPDF";

const TableActions = ({
  student,
  experimentNo,
  handleViewRubrics,
  subjectName,
}) => {
  const [downloadAvailable, setDownloadAvailable] = useState(true);

  useEffect(() => {
    const hasValidMarks = student.allExperimentMarks.every((experiment) => {
      const sum = experiment.reduce((total, mark) => total + mark, 0);
      return sum > 0;
    });

    setDownloadAvailable(hasValidMarks);
  }, [student]);

  return (
    <div className="flex justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleViewRubrics(student)}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" />
        View
      </Button>

      {/* {downloadAvailable ? (
        <PDFDownloadLink
          document={
            <RubricsPDF
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
            <Button
              variant="outline"
              size="sm"
              disabled={!downloadAvailable}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              {loading ? "Loading..." : "Download"}
            </Button>
          )}
        </PDFDownloadLink>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      )} */}
    </div>
  );
};

export default TableActions;
