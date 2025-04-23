import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "react-router";
import MarksInput from "./MarksInput";
import TableActions from "./TableActions";
import TableHeaderCustom from "./TableHeader";
import TableToolbar from "./TableToolbar";
import TablePagination from "./TablePagination";
import useStudentData from "./useStudentData";
import StudentRubricsModal from "@/components/StudentRubricsModal";
import axios from "axios";
import { Spinner } from "@/components/Spinner";
import toast from "react-hot-toast";
import { useStore } from "@/store/useStore";

const DataTableComp = ({ editMode, setEditMode, experimentNo }) => {
  const [searchParams] = useSearchParams();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [marksInputType, setMarksInputType] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isRubricsModalOpen, setIsRubricsModalOpen] = useState(false);
  const [scoringType, setScoringType] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [criteria, setCriteria] = useState([]);

  const currentSubject = searchParams.get("sub") || "DevOps";
  const subjectCriterias = useStore((state) => state.subjectCriterias);
  const subjectExists = subjectCriterias.some(
    (subject) => subject.subjectId === currentSubject
  );

  const {
    loading,
    error,
    studentsData,
    setStudentsData,
    sectionMarks,
    setSectionMarks,
    customMarks,
    setCustomMarks,
  } = useStudentData(currentSubject, experimentNo);

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const subjectResponse = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/subjects/name/${currentSubject}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!subjectResponse.data?._id) return;

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
          rubricsResponse.data.criteria.length > 0
        ) {
          setCriteria(rubricsResponse.data.criteria);
        } else {
          setCriteria([
            { title: "Knowledge", marks: 5, order: 1 },
            { title: "Describe", marks: 5, order: 2 },
            { title: "Demonstration", marks: 5, order: 3 },
            { title: "Strategy", marks: 5, order: 4 },
            { title: "Interpret / Develop", marks: 5, order: 5 },
            { title: "Attitude", marks: 5, order: 6 },
            { title: "Non-verbal Skills", marks: 5, order: 7 },
          ]);
        }
      } catch (error) {
        console.error("Error fetching criteria:", error);
      }
    };

    fetchCriteria();
  }, [currentSubject]);

  const handleMarksChange = (rowId, value, sectionId = null) => {
    if (sectionId) {
      setSectionMarks((prev) => ({
        ...prev,
        [rowId]: {
          ...(prev[rowId] || {}),
          [sectionId]:
            value === "" ? "" : Math.min(Math.max(0, Number(value)), 5),
        },
      }));
    } else {
      if (value === "") {
        setCustomMarks((prev) => ({ ...prev, [rowId]: "" }));
        return;
      }

      const numValue = Number(value);
      if (!isNaN(numValue)) {
        const clampedValue = Math.min(Math.max(0, numValue), 25);
        setCustomMarks((prev) => ({ ...prev, [rowId]: clampedValue }));
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      const overallChanges = Object.entries(customMarks)
        .map(([rowId, newMarks]) => {
          const tableRow = table
            .getRowModel()
            .rows.find((row) => row.id === rowId);
          if (!tableRow) return null;

          const student = tableRow.original;
          const newMarksArray = distributeMarks(newMarks);

          return {
            studentName: student.studentName,
            rollNo: student.rollNo,
            type: "overall",
            oldMarks: student.totalMarks,
            newMarks,
            studentId: student.studentId,
            experimentId: student.experimentId,
            newMarksArray,
          };
        })
        .filter(Boolean);

      const sectionChanges = Object.entries(sectionMarks)
        .map(([rowId, sections]) => {
          const tableRow = table
            .getRowModel()
            .rows.find((row) => row.id === rowId);
          if (!tableRow) return null;

          const student = tableRow.original;

          const sectionMarksArray = [
            Number(sections.section1 || 0),
            Number(sections.section2 || 0),
            Number(sections.section3 || 0),
            Number(sections.section4 || 0),
            Number(sections.section5 || 0),
          ];

          const totalSectionMarks = sectionMarksArray.reduce(
            (sum, mark) => sum + mark,
            0
          );

          return {
            studentName: student.studentName,
            rollNo: student.rollNo,
            type: "sectional",
            oldMarks: student.totalMarks,
            newMarksArray: sectionMarksArray,
            studentId: student.studentId,
            experimentId: student.experimentId,
            totalMarks: totalSectionMarks,
          };
        })
        .filter(Boolean);

      const allChanges = [...overallChanges, ...sectionChanges];

      if (allChanges.length === 0) {
        setIsSaving(false);
        setEditMode(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/students/update-marks`,
        allChanges
      );

      const updatedStudentsData = studentsData.map((student) => {
        const change = allChanges.find(
          (c) => c.studentId === student.studentId
        );
        if (change) {
          return {
            ...student,
            totalMarks: change.totalMarks || change.newMarks,
          };
        }
        return student;
      });
      setStudentsData(updatedStudentsData);
      setCustomMarks({});
      setSectionMarks({});
      setMarksInputType({});
      setScoringType({});
      setEditMode(false);
    } catch (error) {
      console.error("Error updating marks:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const distributeMarks = (totalMarks) => {
    totalMarks = Math.round(Number(totalMarks));

    const marks = new Array(criteria.length).fill(0);

    const totalMaxMarks = criteria.reduce(
      (sum, criterion) => sum + (criterion.marks || 0),
      0
    );

    if (totalMaxMarks === 0 || criteria.length === 0) {
      return marks;
    }

    criteria.forEach((criterion, index) => {
      if (criterion.marks === 0) {
        marks[index] = 0;
      } else {
        const proportionalMarks =
          (totalMarks * criterion.marks) / totalMaxMarks;
        marks[index] = Math.min(Math.round(proportionalMarks), criterion.marks);
      }
    });

    const currentTotal = marks.reduce((sum, mark) => sum + mark, 0);
    let difference = totalMarks - currentTotal;

    while (difference !== 0) {
      for (let i = 0; i < marks.length && difference !== 0; i++) {
        if (criteria[i].marks === 0) continue; // Skip criteria with 0 marks

        if (difference > 0 && marks[i] < criteria[i].marks) {
          marks[i]++;
          difference--;
        } else if (difference < 0 && marks[i] > 0) {
          marks[i]--;
          difference++;
        }
      }
      if (
        difference !== 0 &&
        marks.every(
          (mark, i) => mark === (difference > 0 ? criteria[i].marks : 0)
        )
      )
        break;
    }

    return marks;
  };

  const handleViewRubrics = (student) => {
    if (!subjectExists) {
      toast.error("No rubrics found for this subject");
      return;
    }
    setSelectedStudent(student);
    setIsRubricsModalOpen(true);
  };

  useEffect(() => {
    if (editMode) {
      setColumnVisibility((prev) => ({ ...prev, actions: false }));
    } else {
      setColumnVisibility((prev) => ({ ...prev, actions: true }));
    }
  }, [editMode]);

  useEffect(() => {
    setCustomMarks({});
    setSectionMarks({});
    setMarksInputType({});
    setScoringType({});
    if (editMode) setEditMode(false);
  }, [currentSubject, experimentNo, setEditMode]);

  const columns = [
    {
      accessorKey: "rollNo",
      header: ({ column }) => (
        <TableHeaderCustom column={column} title="Roll No" />
      ),
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("rollNo")}</div>
      ),
    },
    {
      accessorKey: "sapId",
      header: ({ column }) => (
        <TableHeaderCustom column={column} title="SAP ID" />
      ),
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("sapId")}</div>
      ),
    },
    {
      accessorKey: "studentName",
      header: ({ column }) => (
        <TableHeaderCustom column={column} title="Student Name" />
      ),
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("studentName")}</div>
      ),
    },
    {
      accessorKey: "totalMarks",
      header: ({ column }) => (
        <TableHeaderCustom column={column} title="Marks" />
      ),
      cell: ({ row }) => {
        if (editMode) {
          return (
            <MarksInput
              row={row}
              currentSubject={currentSubject}
              scoringType={scoringType}
              setScoringType={setScoringType}
              sectionMarks={sectionMarks}
              setSectionMarks={setSectionMarks}
              customMarks={customMarks}
              setCustomMarks={setCustomMarks}
              marksInputType={marksInputType}
              setMarksInputType={setMarksInputType}
              handleMarksChange={handleMarksChange}
              disabled={isSaving}
            />
          );
        }
        const totalMarks = row.getValue("totalMarks");
        return <div className="text-left font-medium">{totalMarks}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <TableActions
          subjectName={currentSubject}
          student={row.original}
          experimentNo={experimentNo}
          handleViewRubrics={handleViewRubrics}
          disabled={loading || isSaving}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: studentsData || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) {
    return (
      <div className="max-w-[80%] mx-auto flex items-center justify-center h-64">
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="max-w-[80%] mx-auto p-4 border border-red-200 rounded-md bg-red-50 text-center my-4">
        <p className="text-red-500">
          Error loading data: {error.message || "Failed to load student data"}
        </p>
        <button
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[80%] mx-auto relative">
      {isSaving && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <div className="text-center bg-white p-4 rounded-md shadow-md">
            <Spinner className="h-8 w-8 mx-auto" />
            <p className="mt-2 text-sm text-gray-500">Saving changes...</p>
          </div>
        </div>
      )}

      <TableToolbar
        table={table}
        editMode={editMode}
        handleSaveChanges={handleSaveChanges}
        setEditMode={setEditMode}
        disabled={loading || isSaving}
      />

      <div className={`rounded-md border ${editMode && "bg-gray-50"}`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} disabled={loading || isSaving} />

      <StudentRubricsModal
        subjectName={currentSubject}
        isOpen={isRubricsModalOpen}
        onClose={() => setIsRubricsModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
};

export default DataTableComp;
