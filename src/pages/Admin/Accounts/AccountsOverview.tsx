// "use client";
// import React, { useState, useEffect } from "react";

// const AccountsOverview = () => {
//   // State for time period filter
//   const [period, setPeriod] = useState("monthly"); // monthly, session, semester
//   const [selectedMonth, setSelectedMonth] = useState("January");
//   const [selectedYear, setSelectedYear] = useState("2026");
//   const [isLoading, setIsLoading] = useState(false);
//   const [feeData, setFeeData] = useState(null);

//   // Initial sample data structure - will be replaced by API data
//   const initialFeeData = {
//     monthly: {
//       totalCollected: 850000,
//       totalDue: 280000,
//       totalStudents: 500,
//       paidStudents: 420,
//       unpaidStudents: 80,
//       collectionRate: 75.2,
//       paymentRate: 84.0,
//       months: [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December",
//       ],
//       years: ["2026", "2025", "2024", "2023"],
//       feeCategories: [
//         {
//           name: "Tuition Fee",
//           collected: 500000,
//           due: 150000,
//           collectionRate: 76.9,
//         },
//         {
//           name: "It Charge",
//           collected: 150000,
//           due: 50000,
//           collectionRate: 75.0,
//         },
//         {
//           name: "Electricity Bill",
//           collected: 100000,
//           due: 40000,
//           collectionRate: 71.4,
//         },
//         {
//           name: "Others Charge",
//           collected: 100000,
//           due: 40000,
//           collectionRate: 71.4,
//         },
//       ],
//     },

//     session: {
//       totalCollected: 3000000,
//       totalDue: 1000000,
//       totalStudents: 500,
//       paidStudents: 450,
//       unpaidStudents: 50,
//       collectionRate: 75.0,
//       paymentRate: 90.0,
//       years: ["2026", "2025", "2024", "2023", "2022"],
//       feeCategories: [
//         {
//           name: "Session Fee",
//           collected: 2000000,
//           due: 800000,
//           collectionRate: 71.4,
//         },
//         {
//           name: "Admission Fee",
//           collected: 1000000,
//           due: 200000,
//           collectionRate: 83.3,
//         },
//       ],
//     },

//     semester: {
//       totalCollected: 1180000,
//       totalDue: 320000,
//       totalStudents: 500,
//       paidStudents: 400,
//       unpaidStudents: 100,
//       collectionRate: 78.7,
//       paymentRate: 80.0,
//       // Semester specific periods - can be "Jan-Jun", "Jul-Dec", etc.
//       semesters: ["Jan-Jun", "Jul-Dec"],
//       years: ["2026", "2025", "2024", "2023"],
//       feeCategories: [
//         {
//           name: "Semester Fee",
//           collected: 1180000,
//           due: 320000,
//           collectionRate: 78.7,
//         },
//       ],
//     },
//   };

//   // Initialize with sample data
//   useEffect(() => {
//     setFeeData(initialFeeData);
//   }, []);

//   // Simulate API call
//   const fetchFeeData = async (selectedPeriod, month, year) => {
//     setIsLoading(true);
//     // Here you will call your actual API
//     // Example: const response = await fetch(`/api/fee-overview?period=${selectedPeriod}&month=${month}&year=${year}`);
//     // const data = await response.json();
//     // setFeeData(data);

//     // For demo, using timeout to simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 500);
//   };

//   useEffect(() => {
//     fetchFeeData(period, selectedMonth, selectedYear);
//   }, [period, selectedMonth, selectedYear]);

//   if (!feeData) return <div>Loading...</div>;

//   const currentData = feeData[period];

//   return (
//     <div className="p-4 space-y-6">
//       {/* Header with Filters */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">
//             Student Fee Collection
//           </h1>
//           <p className="text-gray-600">Gazipur Shaheen Cadet Academy</p>
//         </div>

//         <div className="flex flex-wrap gap-3">
//           <div className="join">
//             <button
//               className={`join-item btn ${
//                 period === "monthly" ? "btn-active" : ""
//               }`}
//               onClick={() => setPeriod("monthly")}
//               disabled={isLoading}
//             >
//               {isLoading && period === "monthly" ? (
//                 <span className="loading loading-spinner loading-xs"></span>
//               ) : (
//                 "Monthly Fee"
//               )}
//             </button>

//             <button
//               className={`join-item btn ${
//                 period === "session" ? "btn-active" : ""
//               }`}
//               onClick={() => setPeriod("session")}
//               disabled={isLoading}
//             >
//               {isLoading && period === "session" ? (
//                 <span className="loading loading-spinner loading-xs"></span>
//               ) : (
//                 "Session Fee"
//               )}
//             </button>

//             <button
//               className={`join-item btn ${
//                 period === "semester" ? "btn-active" : ""
//               }`}
//               onClick={() => setPeriod("semester")}
//               disabled={isLoading}
//             >
//               {isLoading && period === "semester" ? (
//                 <span className="loading loading-spinner loading-xs"></span>
//               ) : (
//                 "Semester Fee"
//               )}
//             </button>
//           </div>

//           {/* Month Selector (Only for Monthly view) */}
//           {period === "monthly" && (
//             <>
//               <select
//                 className="select select-bordered"
//                 value={selectedMonth}
//                 onChange={(e) => setSelectedMonth(e.target.value)}
//                 disabled={isLoading}
//               >
//                 {feeData.monthly.months.map((month) => (
//                   <option key={month} value={month}>
//                     {month}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 className="select select-bordered"
//                 value={selectedYear}
//                 onChange={(e) => setSelectedYear(e.target.value)}
//                 disabled={isLoading}
//               >
//                 {feeData.monthly.years.map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//             </>
//           )}

//           {/* Year Selector (For Session view) */}
//           {period === "session" && (
//             <select
//               className="select select-bordered"
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(e.target.value)}
//               disabled={isLoading}
//             >
//               {feeData.session.years.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//           )}

//           {/* Semester and Year Selector (For Semester view) */}
//           {period === "semester" && (
//             <>
//               <select
//                 className="select select-bordered"
//                 value={selectedMonth}
//                 onChange={(e) => setSelectedMonth(e.target.value)}
//                 disabled={isLoading}
//               >
//                 {feeData.semester.semesters.map((semester) => (
//                   <option key={semester} value={semester}>
//                     {semester}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 className="select select-bordered"
//                 value={selectedYear}
//                 onChange={(e) => setSelectedYear(e.target.value)}
//                 disabled={isLoading}
//               >
//                 {feeData.semester.years.map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Total Students Card */}
//         <div className="card bg-base-100 shadow border-l-4 border-blue-500">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">
//                   Total Students
//                 </h3>
//                 <p className="text-2xl font-bold mt-2">
//                   {currentData.totalStudents}
//                 </p>
//                 <div className="flex gap-2 mt-1">
//                   <span className="text-sm text-green-600">
//                     {currentData.paidStudents} Paid
//                   </span>
//                   <span className="text-sm text-red-600">
//                     {currentData.unpaidStudents} Due
//                   </span>
//                 </div>
//               </div>
//               <div className="text-blue-500">
//                 <svg
//                   className="w-8 h-8"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10 10 0 01-.67 3.476"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Fee Collection Card */}
//         <div className="card bg-base-100 shadow border-l-4 border-green-500">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Paid Fee</h3>
//                 <p className="text-2xl font-bold mt-2">
//                   ৳ {currentData.totalCollected.toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Collection Rate: {currentData.collectionRate}%
//                 </p>
//               </div>
//               <div className="text-green-500">
//                 <svg
//                   className="w-8 h-8"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Due Amount Card */}
//         <div className="card bg-base-100 shadow border-l-4 border-red-500">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Due</h3>
//                 <p className="text-2xl font-bold mt-2">
//                   ৳ {currentData.totalDue.toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {currentData.unpaidStudents} Students
//                 </p>
//               </div>
//               <div className="text-red-500">
//                 <svg
//                   className="w-8 h-8"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Payment Rate Card */}
//         <div className="card bg-base-100 shadow border-l-4 border-purple-500">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">
//                   Payment Rate
//                 </h3>
//                 <p className="text-2xl font-bold mt-2">
//                   {currentData.paymentRate}%
//                 </p>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {currentData.paidStudents} Students Paid <br />
//                   {currentData.unpaidStudents} Students Have Due
//                 </p>
//               </div>
//               <div className="text-purple-500">
//                 <svg
//                   className="w-8 h-8"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
//                   />
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Fee Categories Breakdown */}
//       <div className="card bg-base-100 shadow">
//         <div className="card-body">
//           <h2 className="card-title">
//             {period === "monthly" && "Monthly Fee Collection by Category"}
//             {period === "session" && "Session Fee Collection by Category"}
//             {period === "semester" && "Semester Fee Collection"}
//           </h2>
//           <div className="overflow-x-auto mt-4">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Fee Type</th>
//                   <th>Collected</th>
//                   <th>Due</th>
//                   <th>Total</th>
//                   <th>Collection Rate</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentData.feeCategories.map((category, index) => {
//                   const total = category.collected + category.due;

//                   return (
//                     <tr key={index}>
//                       <td className="font-medium">{category.name}</td>
//                       <td>
//                         <div className="flex items-center">
//                           <span className="font-semibold text-green-600">
//                             ৳ {category.collected.toLocaleString()}
//                           </span>
//                         </div>
//                       </td>
//                       <td>
//                         <span className="font-semibold text-red-600">
//                           ৳ {category.due.toLocaleString()}
//                         </span>
//                       </td>
//                       <td>৳ {total.toLocaleString()}</td>
//                       <td>
//                         <div className="flex items-center gap-2">
//                           <div className="w-24 bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-green-500 h-2 rounded-full"
//                               style={{ width: `${category.collectionRate}%` }}
//                             ></div>
//                           </div>
//                           <span>{category.collectionRate}%</span>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="card bg-base-100 shadow">
//         <div className="card-body">
//           <h2 className="card-title">Quick Actions</h2>
//           <div className="flex flex-wrap gap-3 mt-4">
//             <button className="btn btn-primary">
//               <svg
//                 className="w-4 h-4 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//               Collect New Fee
//             </button>
//             <button className="btn btn-outline">
//               <svg
//                 className="w-4 h-4 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//               Generate Report
//             </button>
//             <button className="btn btn-outline">
//               <svg
//                 className="w-4 h-4 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                 />
//               </svg>
//               Send Reminder
//             </button>
//             <button className="btn btn-outline">
//               <svg
//                 className="w-4 h-4 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
//                 />
//               </svg>
//               Export Data
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountsOverview;

import React from "react";

const AccountsOverview = () => {
  return <div>Over view</div>;
};

export default AccountsOverview;
