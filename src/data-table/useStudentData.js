import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from 'react-router-dom';

const useStudentData = (currentSubject) => {
  const [searchParams] = useSearchParams();
  const experimentNo = searchParams.get("exp");

  const [studentsData, setStudentsData] = useState([]);
  const [sectionMarks, setSectionMarks] = useState({});
  const [customMarks, setCustomMarks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }

        await new Promise((resolve) => setTimeout(resolve, 300));

        const allData = JSON.parse(localStorage.getItem("allData"));
        if (!allData && isMounted) {
          setIsLoading(false);
          setError(new Error("No data found in local storage"));
          return;
        }

        const currentBatch = allData.batches && allData.batches[0];
        if (!currentBatch && isMounted) {
          setIsLoading(false);
          setError(new Error("No batch data found"));
          return;
        }

        const students = currentBatch.students || [];
        const subjectData = currentBatch.subjects.find(
          (subject) => subject.name === currentSubject
        );

        if (!subjectData && isMounted) {
          setIsLoading(false);
          setError(new Error(`Subject "${currentSubject}" not found`));
          return;
        }

        if (
          students.length > 0 &&
          students[0].experiments &&
          (experimentNo < 1 || experimentNo > students[0].experiments.length) &&
          isMounted
        ) {
          setIsLoading(false);
          setError(new Error(`Experiment #${experimentNo} not found`));
          return;
        }

        const formattedData = students.map((student) => {
          const experimentData = student.experiments.find((item) => item.experimentId === experimentNo);
          // Filter experiments for current subject only
          const subjectExperiments = student.experiments.filter(exp => 
            exp.subject === currentSubject
          );
          
          return {
            rollNo: student.rollNo,
            sapId: student.sapId,
            studentName: student.studentName,
            marks: experimentData?.marks || Array(5).fill(0),
            totalMarks:
              experimentData?.marks?.reduce((acc, mark) => acc + mark, 0) || 0,
            studentId: student._id,
            experimentId: experimentData ? experimentData.experimentId : null,
            allExperimentMarks: subjectExperiments.map((exp) => exp.marks),
            remarks: experimentData?.remarks || "",
          };
        });


        if (isMounted) {
          // Initialize section marks
          const initialSectionMarks = {};
          formattedData.forEach((student) => {
            initialSectionMarks[student.rollNo] = {};
            student.marks.forEach((mark, index) => {
              initialSectionMarks[student.rollNo][index + 1] = mark;
            });
          });

          // Initialize custom marks
          const initialCustomMarks = {};
          formattedData.forEach((student) => {
            initialCustomMarks[student.rollNo] = student.totalMarks;
          });

          setStudentsData(formattedData);
          setSectionMarks(initialSectionMarks);
          setCustomMarks(initialCustomMarks);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        if (isMounted) {
          setStudentsData([]);
          setSectionMarks({});
          setCustomMarks({});
          setError(error);
          setIsLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function to prevent state updates after unmounting
    return () => {
      isMounted = false;
    };
  }, [currentSubject, experimentNo]);

  // Function to update local storage after saving changes
  const updateLocalStorage = (updatedStudents) => {
    try {
      const allData = JSON.parse(localStorage.getItem("allData"));
      if (!allData) return false;

      const batchIndex = 0; // Assuming we're working with the first batch

      // Deep clone to avoid reference issues
      const newAllData = JSON.parse(JSON.stringify(allData));

      updatedStudents.forEach((updatedStudent) => {
        const studentIndex = newAllData.batches[batchIndex].students.findIndex(
          (s) => s._id === updatedStudent.studentId
        );

        if (studentIndex >= 0) {
          const experimentIndex = experimentNo - 1;

          // Update the marks in the experiment
          if (
            newAllData.batches[batchIndex].students[studentIndex].experiments[
              experimentIndex
            ]
          ) {
            newAllData.batches[batchIndex].students[studentIndex].experiments[
              experimentIndex
            ].marks = updatedStudent.newMarksArray || updatedStudent.marks;
          }
        }
      });

      localStorage.setItem("allData", JSON.stringify(newAllData));
      return true;
    } catch (error) {
      console.error("Error updating localStorage:", error);
      return false;
    }
  };

  return {
    studentsData,
    setStudentsData,
    sectionMarks,
    setSectionMarks,
    customMarks,
    setCustomMarks,
    isLoading,
    error,
    updateLocalStorage,
    experimentNo,
  };
};

export default useStudentData;
