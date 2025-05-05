import { create } from "zustand";

export const useStore = create((set) => ({
  subjectCriterias: [],
  teacherData: null,
  courseCodeOutcomes: [],

  setSubjectCriterias: (newCriteria) =>
    set((state) => {
      const exists = state.subjectCriterias.find(
        (item) => item.subjectId === newCriteria.subjectId
      );

      let updatedList;
      if (exists) {
        updatedList = state.subjectCriterias.map((item) =>
          item.subjectId === newCriteria.subjectId ? newCriteria : item
        );
      } else {
        updatedList = [...state.subjectCriterias, newCriteria];
      }

      return { subjectCriterias: updatedList };
    }),

  setTeacherData: (teacherData) => set({ teacherData }),

  setCourseCodeOutcomes: (newOutcomes) =>
    set((state) => {
      const exists = state.courseCodeOutcomes.find(
        (item) => item.subjectId === newOutcomes.subjectId
      );

      let updatedList;
      if (exists) {
        updatedList = state.courseCodeOutcomes.map((item) =>
          item.subjectId === newOutcomes.subjectId ? newOutcomes : item
        );
      } else {
        updatedList = [...state.courseCodeOutcomes, newOutcomes];
      }

      return { courseCodeOutcomes: updatedList };
    }),
}));
