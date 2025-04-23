import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import RubricsTop from "@/assets/rubrics_top.png";
import RubricsBottom from "@/assets/rubrics_bottom.png";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Times-Roman",
    fontWeight: "bold",
  },
  pageBorder: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  headerImg: {
    maxWidth: "80%",
    margin: "0 auto",
  },
  headerLogo: {
    width: 60,
    height: 60,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 2,
  },
  departmentTitle: {
    fontWeight: "bold",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 2,
  },
  assessmentTitle: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
    textDecoration: "underline",
  },
  academicYear: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-between",
  },
  infoRowBottom: {
    flexDirection: "row",
    marginTop: 18,
    marginLeft: 5,
    justifyContent: "space-between",
  },
  infoRowBottomTwo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 5,
    marginRight: 30,
    marginTop: 18,
  },
  infoItemBottom: {
    flexDirection: "row",
    gap: 5,
  },
  infoLabelBottom: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 0,
  },
  infoValueBottom: {
    fontSize: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
    width: 120,
  },
  infoValueBottomNoUnderline: {
    fontSize: 12,
    borderBottomColor: "#000",
    width: 100,
    marginRight: 10,
  },
  infoLeft: {
    flex: 1,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 5,
  },
  infoValue: {
    fontSize: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
    width: 250,
    marginRight: 10,
  },
  infoValueRightUnderlined: {
    fontSize: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
    width: 150,
    paddingLeft: 5,
  },
  infoValueRight: {
    fontSize: 12,
    width: 150,
    paddingLeft: 5,
  },
  infoLabelRight: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 5,
    marginLeft: 20,
  },
  courseInfoValue: {
    fontSize: 12,
    marginRight: 10,
  },
  infoValueFilled: {
    width: "35%",
    fontSize: 12,
    marginRight: 10,
  },
  table: {
    display: "table",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
    marginBottom: 2,
    maxWidth: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: "bold",
    padding: 3,
    textAlign: "center",
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableCellFields: {
    fontSize: 12,
    padding: 3,
    textAlign: "left",
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
    display: "flex",
  },
  tableCell: {
    fontSize: 12,
    padding: 3,
    textAlign: "left",
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 25,
  },
  tableCellLeft: {
    fontSize: 12,
    padding: 3,
    textAlign: "left",
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  indicatorCell: {
    width: "40%",
  },
  numberCell: {
    width: "6%",
  },
  signatureMainCol: {
    display: "flex",
  },
  footerImg: {
    maxWidth: "70%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  smallText: {
    fontSize: 11,
  },
  boldText: {
    fontFamily: "Times-Bold",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
  },
});

const RubricsPDF = ({ finalCO, finalCriterias, studentData, subjectName }) => {

  console.log(studentData)

  if (!studentData) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ margin: "auto", textAlign: "center" }}>
            <Text>Missing student data...</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.pageBorder}>
          {/* Document content as before */}
          <View style={styles.header}>
            <Image src={RubricsTop} style={styles.headerImg} />
          </View>

          <View>
            <Text style={styles.departmentTitle}>
              DEPARTMENT OF INFORMATION TECHNOLOGY
            </Text>
            <Text style={styles.assessmentTitle}>
              Continuous Assessment for Laboratory / Assignment sessions
            </Text>
            <Text style={styles.academicYear}>Academic Year 2024 - 2025</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>
                {studentData?.studentName || ""}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabelRight}>SAP ID:</Text>
              <Text style={styles.infoValueRight}>
                {studentData?.sapId || ""}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Course:</Text>
              <Text style={styles.courseInfoValue}>
                {subjectName || "Advanced Data Structures Laboratory"}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabelRight}>Course Code:</Text>
              <Text style={styles.infoValueRight}>DJS22ITL502</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Year:</Text>
              <Text style={styles.courseInfoValue}>T. Y. B. Tech</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabelRight}>Sem:</Text>
              <Text style={styles.infoValueRight}>V</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabelRight}>Batch:</Text>
              <Text style={styles.infoValueRight}>
                {studentData?.rollNo || ""}
              </Text>
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCell, styles.indicatorCell]}>
                <Text>Performance Indicators</Text>
                <Text style={styles.smallText}>(Minimum 3 indicators)</Text>
              </View>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <View
                  key={`header-${num}`}
                  style={[styles.tableHeaderCell, styles.numberCell]}
                >
                  <Text>{num}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCell, styles.indicatorCell]}>
                <Text>Course Outcome</Text>
              </View>
              {finalCO?.map((co, index) => (
                <View
                  key={`co-${index}`}
                  style={[styles.tableHeaderCell, styles.numberCell]}
                >
                  <Text>{co}</Text>
                </View>
              ))}
            </View>

            {finalCriterias?.map((criterion, index) => (
              <View style={styles.tableRow} key={`criterion-${index}`}>
                <View style={[styles.tableCellFields, styles.indicatorCell]}>
                  <Text>
                    {index + 1}. {criterion.title || `Criterion ${index + 1}`} (
                    {criterion.marks || 0})
                  </Text>
                  <Text style={styles.smallText}>
                    {criterion.description || ""}
                  </Text>
                </View>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const mark =
                    studentData.allExperimentMarks?.[num - 1]?.[index] || "";
                  return (
                    <View
                      key={`mark-${index}-${num}`}
                      style={[styles.tableCell, styles.numberCell]}
                    >
                      <Text>{criterion.marks === 0 ? "--" : mark}</Text>
                    </View>
                  );
                })}
              </View>
            ))}

            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCell, styles.indicatorCell]}>
                <Text>Total (25)</Text>
              </View>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const totalCol =
                  studentData.allExperimentMarks?.[num - 1] || [];
                const totalColReduced = totalCol.reduce(
                  (acc, mark) => acc + (mark || 0),
                  0
                );
                return (
                  <View
                    key={`total-${num}`}
                    style={[styles.tableHeaderCell, styles.numberCell]}
                  >
                    <Text>{totalColReduced === 0 ? "" : totalColReduced}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.infoRowBottom}>
            <View style={styles.infoItemBottom}>
              <Text style={styles.infoLabelBottom}>Sign of the Student:</Text>
              <Text style={styles.infoValueBottom}></Text>
            </View>
          </View>

          <View style={styles.infoRowBottomTwo}>
            <View style={styles.infoItemBottom}>
              <Text style={styles.infoLabelBottom}>
                Signature of the Faculty member:
              </Text>
              <Text style={styles.infoValueBottomNoUnderline}></Text>
            </View>
            <View style={styles.infoItemBottom}>
              <Text style={styles.infoLabelBottom}>
                Signature of Head of the Department
              </Text>
            </View>
          </View>

          <View style={styles.infoRowBottomTwo}>
            <View style={styles.infoItemBottom}>
              <Text style={styles.infoLabelBottom}>
                Name of the Faculty member:
              </Text>
              <Text style={styles.infoValueBottom}></Text>
            </View>
            <View style={styles.infoItemBottom}>
              <Text style={styles.infoLabelBottom}>Date:</Text>
              <Text style={styles.infoValueBottom}></Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Image src={RubricsBottom} style={styles.footerImg} />
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default RubricsPDF;
