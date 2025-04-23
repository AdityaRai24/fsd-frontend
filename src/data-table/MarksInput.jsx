"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store/useStore";

const MarksInput = ({
  row,
  scoringType,
  setScoringType,
  currentSubject,
  sectionMarks,
  setSectionMarks,
  customMarks,
  setCustomMarks,
  marksInputType,
  setMarksInputType,
  handleMarksChange,
  disabled = false,
}) => {
  const [criteria, setCriteria] = useState([]);
  const currentScoringType = scoringType[row.id] || "overall";
  const student = row.original;

  const subjectCriterias = useStore((state) => state.subjectCriterias);
  const subjectExists = subjectCriterias.some(
    (subject) => subject.subjectId === currentSubject
  );

  useEffect(() => {
    if (!subjectExists || !currentSubject) {
      return;
    }

    const currentSubjectCriteria = subjectCriterias.find(
      (subject) => subject.subjectId === currentSubject
    );

    if (
      currentSubjectCriteria &&
      currentSubjectCriteria.subjectCriteria &&
      currentSubjectCriteria.subjectCriteria.length > 0
    ) {
      setCriteria(currentSubjectCriteria.subjectCriteria);
    }
  }, [currentSubject, subjectCriterias, subjectExists]);

  useEffect(() => {
    if (
      criteria.length > 0 &&
      currentScoringType === "individual" &&
      (!sectionMarks[row.id] || Object.keys(sectionMarks[row.id]).length === 0)
    ) {
      const initialSectionMarks = {};

      if (student.marks && Array.isArray(student.marks)) {
        criteria.forEach((criterion, index) => {
          initialSectionMarks[`section${index + 1}`] =
            criterion.marks === 0 ? "--" : student.marks[index] || 0;
        });

        setSectionMarks((prev) => ({
          ...prev,
          [row.id]: initialSectionMarks,
        }));
      } else {
        criteria.forEach((criterion, index) => {
          initialSectionMarks[`section${index + 1}`] =
            criterion.marks === 0 ? "--" : 0;
        });

        setSectionMarks((prev) => ({
          ...prev,
          [row.id]: initialSectionMarks,
        }));
      }
    }
  }, [
    currentScoringType,
    row.id,
    student.marks,
    criteria,
    setSectionMarks,
    sectionMarks,
  ]);

  const calculateSectionTotal = () => {
    if (!sectionMarks[row.id]) return 0;

    return Object.values(sectionMarks[row.id]).reduce(
      (sum, mark) => sum + (mark === "--" ? 0 : Number(mark || 0)),
      0
    );
  };

  const getMaximumPossibleTotal = () => {
    return criteria.reduce((sum, criterion) => sum + (criterion.marks || 0), 0);
  };

  const getSectionValue = (sectionId) => {
    const index = parseInt(sectionId.replace("section", "")) - 1;
    const criterion = criteria[index];

    if (criterion && criterion.marks === 0) {
      return "--";
    }

    if (sectionMarks[row.id]?.[sectionId] !== undefined) {
      return sectionMarks[row.id][sectionId];
    }

    return student.marks && student.marks[index] !== undefined
      ? student.marks[index]
      : 0;
  };

  const handleScoringTypeChange = (value) => {
    setScoringType((prev) => ({ ...prev, [row.id]: value }));

    if (value === "overall") {
      setSectionMarks((prev) => ({ ...prev, [row.id]: {} }));
    } else {
      // Initialize section marks when switching to individual mode
      const initialSectionMarks = {};
      if (student.marks && Array.isArray(student.marks)) {
        criteria.forEach((criterion, index) => {
          initialSectionMarks[`section${index + 1}`] =
            criterion.marks === 0 ? "--" : student.marks[index] || 0;
        });
      } else {
        // Initialize with zeros if no student marks available
        criteria.forEach((criterion, index) => {
          initialSectionMarks[`section${index + 1}`] =
            criterion.marks === 0 ? "--" : 0;
        });
      }

      setSectionMarks((prev) => ({
        ...prev,
        [row.id]: initialSectionMarks,
      }));

      setCustomMarks((prev) => {
        const newMarks = { ...prev };
        delete newMarks[row.id];
        return newMarks;
      });
    }
  };

  if (!subjectExists || criteria.length === 0) {
    return (
      <Card className="w-full shadow-sm border-gray-100">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">
            No assessment criteria available for this subject.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm border-gray-100">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-sm font-medium text-gray-700">
          Student Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-4 px-4">
        <RadioGroup
          value={currentScoringType}
          onValueChange={handleScoringTypeChange}
          className="flex items-center gap-4 mb-2 bg-gray-50 p-2 rounded-md"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem
              value="overall"
              id={`overall-${row.id}`}
              disabled={disabled}
              className="data-[state=checked]:bg-blue-600"
            />
            <Label
              htmlFor={`overall-${row.id}`}
              className="text-sm cursor-pointer"
            >
              Overall Score
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem
              value="individual"
              id={`individual-${row.id}`}
              disabled={disabled}
              className="data-[state=checked]:bg-blue-600"
            />
            <Label
              htmlFor={`individual-${row.id}`}
              className="text-sm cursor-pointer"
            >
              Section Breakdown
            </Label>
          </div>
        </RadioGroup>

        <div className="min-h-64">
          {currentScoringType === "overall" ? (
            <div className="flex gap-3 items-center bg-white p-3 rounded-md border border-gray-100">
              <Label className="text-sm min-w-20">Total Marks:</Label>
              <Select
                value={
                  customMarks[row.id]?.toString() ||
                  student.totalMarks?.toString() ||
                  "0"
                }
                onValueChange={(value) => {
                  if (value === "custom") {
                    setMarksInputType((prev) => ({
                      ...prev,
                      [row.id]: "custom",
                    }));
                  } else {
                    setCustomMarks((prev) => ({
                      ...prev,
                      [row.id]: Number(value),
                    }));
                  }
                }}
                disabled={disabled}
              >
                <SelectTrigger className="w-32 bg-white border-gray-200">
                  <SelectValue placeholder="Select marks" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 5, 10, 15, 20, 21, 22, 23, 24, 25].map((mark) => (
                    <SelectItem key={mark} value={mark.toString()}>
                      {mark}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>

              {marksInputType[row.id] === "custom" && (
                <Input
                  type="number"
                  min="0"
                  max={getMaximumPossibleTotal()}
                  value={
                    customMarks[row.id] !== undefined
                      ? customMarks[row.id]
                      : student.totalMarks || 0
                  }
                  onChange={(e) => handleMarksChange(row.id, e.target.value)}
                  className="w-20 bg-white border-gray-200"
                  disabled={disabled}
                />
              )}
              <span className="text-sm text-gray-500 ml-1">
                / {getMaximumPossibleTotal()}
              </span>
            </div>
          ) : (
            <div className="space-y-2 bg-white p-3 rounded-md border border-gray-100">
              {criteria.map((criterion, index) => (
                <div
                  key={`section${index + 1}`}
                  className={`flex items-center justify-between ${
                    index > 0 ? "pt-2 border-t border-gray-100" : ""
                  }`}
                >
                  <Label
                    className="w-36 text-sm font-medium"
                    htmlFor={`section${index + 1}-${row.id}`}
                  >
                    {criterion.title}
                  </Label>
                  <div className="flex items-center gap-2">
                    {criterion.marks === 0 ? (
                      <div className="w-16 text-center bg-gray-100 rounded-md py-1 px-2 text-gray-500 font-medium">
                        --
                      </div>
                    ) : (
                      <Input
                        id={`section${index + 1}-${row.id}`}
                        type="number"
                        min="0"
                        max={criterion.marks}
                        value={getSectionValue(`section${index + 1}`)}
                        onChange={(e) =>
                          handleMarksChange(
                            row.id,
                            e.target.value,
                            `section${index + 1}`
                          )
                        }
                        className="w-16 text-center bg-white border-gray-200"
                        disabled={disabled || criterion.marks === 0}
                      />
                    )}
                    <span className="text-xs text-gray-500 min-w-8">
                      / {criterion.marks}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-200">
                <span className="text-sm font-medium">Total Score</span>
                <div className="font-medium text-blue-600">
                  {calculateSectionTotal()}{" "}
                  <span className="text-gray-500 text-sm">
                    / {getMaximumPossibleTotal()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarksInput;
