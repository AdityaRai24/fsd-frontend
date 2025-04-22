
    // <header className="bg-blue-800 text-white p-4 shadow-md">
    //     <div className="container mx-auto">
    //       <h1 className="text-2xl font-bold">Rubrics Assessment Generator</h1>
    //       <p className="text-sm">Department of Information Technology</p>
    //     </div>
    //   </header>

    //   <main className="flex-grow container mx-auto p-4 md:p-6">
    //     <div className="bg-white rounded-lg shadow-md p-4 mb-6">
    //       <div className="flex justify-between items-center mb-4">
    //         <h2 className="text-xl font-semibold text-gray-800">
    //           Assessment Rubrics Document
    //         </h2>
    //         <div className="flex space-x-2">
    //           <button
    //             onClick={() => setViewMode("preview")}
    //             className={`px-4 py-2 rounded ${
    //               viewMode === "preview"
    //                 ? "bg-blue-600 text-white"
    //                 : "bg-gray-200 text-gray-700"
    //             }`}
    //           >
    //             Preview
    //           </button>
    //           <button
    //             onClick={() => setViewMode("download")}
    //             className={`px-4 py-2 rounded ${
    //               viewMode === "download"
    //                 ? "bg-blue-600 text-white"
    //                 : "bg-gray-200 text-gray-700"
    //             }`}
    //           >
    //             Download
    //           </button>
    //         </div>
    //       </div>

    //       {viewMode === "preview" ? (
    //         <div
    //           className="border border-gray-300 rounded-lg overflow-hidden"
    //           style={{ height: "calc(100vh - 250px)" }}
    //         >
    //           <PDFViewer width="100%" height="100%" className="border-0">
    //             Hiii
    //             <RubricsPDF />
    //           </PDFViewer>
    //         </div>
    //       ) : (
    //         <div
    //           className="flex flex-col items-center justify-center p-10 border border-gray-300 rounded-lg"
    //           style={{ height: "calc(100vh - 250px)" }}
    //         >
    //           <div className="text-center mb-6">
    //             <h3 className="text-lg font-medium text-gray-800 mb-2">
    //               Your document is ready for download
    //             </h3>
    //             <p className="text-gray-600">
    //               Click the button below to download the PDF
    //             </p>
    //           </div>
    //           <PDFDownloadLink
    //             document={<RubricsPDF />}
    //             fileName="rubrics-assessment.pdf"
    //             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
    //           >
    //             {({ loading }) =>
    //               loading ? (
    //                 "Preparing document..."
    //               ) : (
    //                 <>
    //                   <Download size={20} />
    //                   Download PDF
    //                 </>
    //               )
    //             }
    //           </PDFDownloadLink>
    //         </div>
    //       )}
    //     </div>

    //     <div className="bg-white rounded-lg shadow-md p-4">
    //       <h2 className="text-xl font-semibold text-gray-800 mb-4">
    //         About This Document
    //       </h2>
    //       <p className="text-gray-700 mb-3">
    //         This is a digital version of the Continuous Assessment for
    //         Laboratory/Assignment sessions form used by the Department of
    //         Information Technology.
    //       </p>
    //       <p className="text-gray-700 mb-3">The document includes:</p>
    //       <ul className="list-disc pl-5 text-gray-700 mb-3">
    //         <li>Student and course information fields</li>
    //         <li>Performance indicators assessment table</li>
    //         <li>Course outcomes evaluation criteria</li>
    //         <li>Signature fields for student, faculty, and department head</li>
    //       </ul>
    //       <p className="text-gray-700">
    //         You can preview the document in the viewer above or download it as a
    //         PDF file for printing or digital distribution.
    //       </p>
    //     </div>
    //   </main>

    //   <footer className="bg-gray-800 text-white p-4 text-center text-sm">
    //     <p>
    //       © 2024-2025 Department of Information Technology. All rights reserved.
    //     </p>
    //   </footer> 