import { Text, View } from "@react-pdf/renderer";
import axios from "axios";
import React, { useEffect, useState } from "react";

const CriteriaComp = ({ criteria, subjectName }) => {
  const [finalCriteria, setFinalCriteria] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCriteria = async () => {
      if (typeof window === "undefined") {
        return;
      }

      try {
        const subjectResponse = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/subjects/name/${subjectName}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!subjectResponse.data?._id) {
          console.log("No subject ID found for name:", subjectName);
          // Set default criteria when subject is not found
          const defaultCriteria = [
            {
              title: "Understanding of Concept",
              description: "Evaluates student's grasp of theoretical concepts",
              marks: 5,
            },
            {
              title: "Implementation",
              description: "Ability to implement the solution",
              marks: 5,
            },
            {
              title: "Documentation",
              description: "Quality of code documentation and explanation",
              marks: 5,
            },
            {
              title: "Problem Solving",
              description: "Approaches to problem solving",
              marks: 5,
            },
            {
              title: "Code Quality",
              description: "Readability and efficiency of code",
              marks: 5,
            },
          ];
          setFinalCriteria(defaultCriteria);
          setIsLoading(false);
          return;
        }

        const subjectId = subjectResponse.data._id;

        const rubricsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/rubrics/${subjectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (
          rubricsResponse.data?.criteria &&
          Array.isArray(rubricsResponse.data.criteria) &&
          rubricsResponse.data.criteria.length > 0
        ) {
          console.log("Using custom criteria:", rubricsResponse.data.criteria);
          setFinalCriteria(rubricsResponse.data.criteria);
        } else {
          console.log("No custom criteria found, using defaults");
          // Set default criteria when no custom criteria found
          setFinalCriteria([
            {
              title: "Understanding of Concept",
              description: "Evaluates student's grasp of theoretical concepts",
              marks: 5,
            },
            {
              title: "Implementation",
              description: "Ability to implement the solution",
              marks: 5,
            },
            {
              title: "Documentation",
              description: "Quality of code documentation and explanation",
              marks: 5,
            },
            {
              title: "Problem Solving",
              description: "Approaches to problem solving",
              marks: 5,
            },
            {
              title: "Code Quality",
              description: "Readability and efficiency of code",
              marks: 5,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching criteria:", error);
        // Set default criteria on error
        setFinalCriteria([
          {
            title: "Understanding of Concept",
            description: "Evaluates student's grasp of theoretical concepts",
            marks: 5,
          },
          {
            title: "Implementation",
            description: "Ability to implement the solution",
            marks: 5,
          },
          {
            title: "Documentation",
            description: "Quality of code documentation and explanation",
            marks: 5,
          },
          {
            title: "Problem Solving",
            description: "Approaches to problem solving",
            marks: 5,
          },
          {
            title: "Code Quality",
            description: "Readability and efficiency of code",
            marks: 5,
          },
        ]);
      } finally {
        // Only set loading to false after we have either custom or default criteria
        setIsLoading(false);
      }
    };

    // Reset loading state and fetch criteria when subjectName changes
    setIsLoading(true);
    setFinalCriteria(null);
    fetchCriteria();
  }, [subjectName]);

  // Show loading state until we have valid criteria data
  // try again
  if (
    isLoading ||
    !finalCriteria ||
    !Array.isArray(finalCriteria) ||
    finalCriteria.length === 0
  ) {
    return (
      <View>
        <Text>Loading criteria...</Text>
      </View>
    );
  }

  return (
    <View>
      {finalCriteria.map((criterion, index) => (
        <View key={index}>
          <Text>{criterion.title || "Unnamed Criterion"}</Text>
          <Text>{criterion.description || "No description available"}</Text>
          <Text>Marks: {criterion.marks || 0}</Text>
        </View>
      ))}
    </View>
  );
};

export default CriteriaComp;
