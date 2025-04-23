import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, Trash2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useStore } from "./store/useStore";

const RubricsSettings = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const defaultCriteria = [
    {
      title: "Knowledge",
      description: "(Factual/Conceptual/Procedural/Metacognitive)",
      marks: 5,
      isNull: false,
      order: 1,
    },
    {
      title: "Describe",
      description: "(Factual/Conceptual/Procedural/Metacognitive)",
      marks: 5,
      isNull: false,
      order: 2,
    },
    {
      title: "Demonstration",
      description: "(Factual/Conceptual/Procedural/Metacognitive)",
      marks: 5,
      isNull: false,
      order: 3,
    },
    {
      title: "Strategy (Analyse & / or Evaluate)",
      description: "(Factual/Conceptual/Procedural/Metacognitive)",
      marks: 0,
      isNull: true,
      prevMarks: 5,
      order: 4,
    },
    {
      title: "Interpret / Develop",
      description: "(Factual/Conceptual/Procedural/Metacognitive)",
      marks: 0,
      isNull: true,
      prevMarks: 5,
      order: 5,
    },
    {
      title: "Attitude towards learning",
      description:
        "(receiving, attending, responding, valuing, organizing, characterization by value)",
      marks: 5,
      isNull: false,
      order: 6,
    },
    {
      title:
        "Non-verbal communication skills/ Behvaviour or Behavioural skills",
      description:
        "(motor skills, hand-eye coordination, gross body movements, finely coordindated body movements speech behaviours)",
      marks: 5,
      isNull: false,
      order: 7,
    },
  ];

  const [criteria, setCriteria] = useState(defaultCriteria);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courseOutcomes, setCourseOutcomes] = useState(Array(10).fill(1));
  const setSubjectCriterias = useStore((state) => state.setSubjectCriterias);

  const handleCriteriaChange = (index, field, value) => {
    const newCriteria = [...criteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setCriteria(newCriteria);
  };

  const handleNullChange = (index, checked) => {
    const newCriteria = [...criteria];
    newCriteria[index] = {
      ...newCriteria[index],
      isNull: checked,
      prevMarks: checked
        ? newCriteria[index].marks || 5
        : newCriteria[index].prevMarks || 5,
      marks: checked ? 0 : newCriteria[index].prevMarks || 5,
    };
    setCriteria(newCriteria);
  };

  const addCriteria = () => {
    if (criteria.length < 10) {
      setCriteria([
        ...criteria,
        {
          title: "",
          description: "",
          marks: 5,
          isNull: false,
        },
      ]);
    }
  };

  const removeCriteria = (index) => {
    if (criteria.length > 1) {
      const newCriteria = criteria.filter((_, i) => i !== index);
      setCriteria(newCriteria);
    }
  };

  const handleCourseOutcomeChange = (index, value) => {
    const newOutcomes = [...courseOutcomes];
    newOutcomes[index] = parseInt(value);
    setCourseOutcomes(newOutcomes);
  };

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        if (!subjectId) {
          setError("No subject selected");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/rubrics/${subjectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data && response.data.criteria) {
          // Process fetched criteria and ensure isNull is true when marks is 0
          const fetchedCriteria = response.data.criteria.map((criterion) => {
            const isMarksZero = criterion.marks === 0;
            return {
              ...criterion,
              isNull: isMarksZero || criterion.isNull || false,
              prevMarks:
                isMarksZero || criterion.isNull
                  ? criterion.prevMarks || 5
                  : undefined,
            };
          });
          setCriteria(fetchedCriteria);
        }

        if (response.data?.courseOutcomes) {
          setCourseOutcomes(response.data.courseOutcomes);
        }
      } catch (error) {
        console.error("Failed to fetch rubrics:", error);
        setError("Failed to fetch rubrics settings");
      }
    };

    fetchRubrics();
  }, [subjectId]);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");
    const courseOutcomes2 = courseOutcomes.map((co) => parseInt(co));

    try {
      if (!subjectId) {
        throw new Error("No subject selected");
      }

      const orderedCriteria = criteria.map((criterion, index) => ({
        ...criterion,
        order: index + 1,
      }));

      const allData = JSON.parse(localStorage.getItem("allData"));
      const subjectName = allData?.batches[0]?.subjects[0]?.name;

      setSubjectCriterias({
        subjectId: subjectName,
        subjectCriteria: orderedCriteria,
        courseOutcomes: courseOutcomes2,
      });

      const storedData = localStorage.getItem("subjectCriterias");
      if (storedData) {
        const editedArray = dataArray.map((obj) => {
          if (obj.id === "subjectId") {
            return {
              ...obj,
              subjectCriteria: orderedCriteria,
              courseOutcomes: courseOutcomes2,
            };
          }
          return obj;
        });
        localStorage.setItem("subjectCriterias", JSON.stringify(editedArray));
      } else {
        const newArray = [
          {
            subjectId: subjectName,
            subjectCriteria: orderedCriteria,
            courseOutcomes: courseOutcomes2,
          },
        ];
        localStorage.setItem("subjectCriterias", JSON.stringify(newArray));
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/rubrics`,
        {
          subject: subjectId,
          criteria: orderedCriteria,
          courseOutcomes: courseOutcomes2,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess("Rubrics criteria updated successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update rubrics criteria";
      setError(errorMessage);
      console.error("Error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!subjectId) {
      navigate("/teacher-dashboard");
    }
  }, [subjectId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <h1 className="ml-4 text-xl font-medium text-gray-900">
                Rubrics Assessment Settings
              </h1>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <Accordion type="multiple" className="space-y-4">
              {/* Course Outcomes Section */}
              <AccordionItem value="course-outcomes">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline">
                  Course Outcomes Configuration
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-gray-50 rounded-lg mt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Specify the Course Outcome (CO) number for each
                      experiment. This will be displayed in the rubrics PDF.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {courseOutcomes.map((co, index) => (
                        <div key={index} className="space-y-2">
                          <Label
                            htmlFor={`co-${index + 1}`}
                            className="text-sm"
                          >
                            Experiment {index + 1}
                          </Label>
                          <Input
                            id={`co-${index + 1}`}
                            type="number"
                            min="1"
                            max="6"
                            value={co}
                            onChange={(e) =>
                              handleCourseOutcomeChange(index, e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      Note: Course Outcomes should be numbers between 1 and 6
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Assessment Criteria Section */}
              <AccordionItem value="assessment-criteria">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline">
                  Assessment Criteria
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">
                        Customize the assessment criteria for student
                        evaluations. Each criterion can have a title,
                        description, and maximum marks. Mark criteria as "Not
                        Applicable" if they shouldn't be included in the
                        assessment.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {criteria.map((criterion, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-gray-50"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <span className="bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded">
                              Criterion {index + 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCriteria(index)}
                              disabled={criteria.length === 1}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid gap-4">
                            <div>
                              <Label htmlFor={`title-${index}`}>Title</Label>
                              <Input
                                id={`title-${index}`}
                                value={criterion.title}
                                onChange={(e) =>
                                  handleCriteriaChange(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter criterion title"
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label htmlFor={`description-${index}`}>
                                Description
                              </Label>
                              <Textarea
                                id={`description-${index}`}
                                value={criterion.description}
                                onChange={(e) =>
                                  handleCriteriaChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter criterion description"
                                className="mt-1"
                              />
                            </div>

                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`isNull-${index}`}
                                  checked={criterion.isNull}
                                  onCheckedChange={(checked) =>
                                    handleNullChange(index, checked)
                                  }
                                />
                                <Label
                                  htmlFor={`isNull-${index}`}
                                  className="text-sm text-gray-700"
                                >
                                  Not Applicable
                                </Label>
                              </div>

                              <div className="flex items-center space-x-4">
                                <div>
                                  <Label htmlFor={`marks-${index}`}>
                                    Maximum Marks
                                  </Label>
                                  <Input
                                    id={`marks-${index}`}
                                    type="number"
                                    value={
                                      criterion.isNull ? 0 : criterion.marks
                                    }
                                    onChange={(e) =>
                                      handleCriteriaChange(
                                        index,
                                        "marks",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    min="1"
                                    max="7"
                                    className="mt-1 w-24"
                                    disabled={criterion.isNull}
                                  />
                                </div>
                                {criterion.isNull && (
                                  <span className="text-sm text-gray-500 italic mt-6">
                                    This criterion will not be included in
                                    assessment
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        onClick={addCriteria}
                        disabled={criteria.length >= 10}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Criterion
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RubricsSettings;
