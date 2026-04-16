"use client";

import React from "react";

// Type definitions
interface NameType {
  bengaliName?: string;
  englishName?: string;
  firstName?: string;
  lastName?: string;
}

interface ImageType {
  url: string;
  publicId: string;
}

interface GuardianInfo {
  name: NameType;
  mobile: string;
  nid: string;
  occupation: string;
  presentAddress: any;
  permanentAddress: any;
}

interface Guardian {
  father: GuardianInfo;
  mother: GuardianInfo;
  localGuardian?: {
    name: string;
    email: string;
    relation: string;
    phone: string;
  };
}

interface Student {
  _id?: string;
  id?: string;
  name?: string | NameType;
  englishName?: string;
  bengaliName?: string;
  rollNo?: string;
  currentClass?: string;
  email?: string;
  image?: ImageType;
  guardian?: Guardian;
}

interface Payment {
  _id: string;
  id: string;
  paymentType: string;
  status: string;
  month?: string;
  year?: string;
  date: string;
  totalAmount: number;
  paidAmount: number;
  due: number;
  invoiceNo: string;
  [key: string]: any;
}

interface StudentPayments {
  monthly: Payment[];
  semester: Payment[];
  annual: Payment[];
}

interface StudentSummary {
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
}

interface StudentWisePayment {
  student: Student;
  payments: StudentPayments;
  summary: StudentSummary;
}

interface StudentPaymentTableProps {
  studentWisePayments: StudentWisePayment[];
}

// Helper function to get student name
const getStudentName = (student: Student): string => {
  if (!student) return "N/A";

  // Check for direct name string
  if (typeof student.name === "string" && student.name) {
    return student.name;
  }

  // Check for name object
  if (student.name && typeof student.name === "object") {
    const nameObj = student.name as NameType;
    return (
      nameObj.englishName ||
      nameObj.bengaliName ||
      nameObj.firstName ||
      `${nameObj.lastName || ""}` ||
      "N/A"
    );
  }

  // Check for direct englishName/bengaliName fields
  if (student.englishName) return student.englishName;
  if (student.bengaliName) return student.bengaliName;

  return "N/A";
};

// Helper function to get student roll number
const getStudentRollNo = (student: Student): string => {
  return student?.rollNo || "N/A";
};

// Helper function to get student class
const getStudentClass = (student: Student): string => {
  return student?.currentClass || "N/A";
};

// Helper function to get student ID
const getStudentId = (student: Student): string => {
  return student?._id || student?.id || "unknown";
};

const StudentPaymentTable: React.FC<StudentPaymentTableProps> = ({
  studentWisePayments,
}) => {
  // Debug logging
  console.log("StudentWisePayments:", studentWisePayments);

  if (!studentWisePayments || studentWisePayments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No payment records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roll No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paid Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payments
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {studentWisePayments.map((studentPayment) => {
            const studentInfo = studentPayment.student;
            const totalPayments =
              (studentPayment.payments?.monthly?.length || 0) +
              (studentPayment.payments?.semester?.length || 0) +
              (studentPayment.payments?.annual?.length || 0);

            const studentName = getStudentName(studentInfo);
            const studentRollNo = getStudentRollNo(studentInfo);
            const studentClass = getStudentClass(studentInfo);
            const studentKey = getStudentId(studentInfo);

            return (
              <tr key={studentKey} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {studentName}
                  </div>
                  {studentInfo?.email && (
                    <div className="text-sm text-gray-500">
                      {studentInfo.email}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {studentRollNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {studentClass}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ৳{studentPayment.summary?.totalAmount?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                  ৳{studentPayment.summary?.totalPaid?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                  ৳{studentPayment.summary?.totalDue?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-1">
                    {studentPayment.payments?.monthly?.length > 0 && (
                      <span
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                        title="Monthly Payments"
                      >
                        M:{studentPayment.payments.monthly.length}
                      </span>
                    )}
                    {studentPayment.payments?.semester?.length > 0 && (
                      <span
                        className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
                        title="Semester Payments"
                      >
                        S:{studentPayment.payments.semester.length}
                      </span>
                    )}
                    {studentPayment.payments?.annual?.length > 0 && (
                      <span
                        className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded"
                        title="Annual Payments"
                      >
                        A:{studentPayment.payments.annual.length}
                      </span>
                    )}
                    {totalPayments === 0 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                        No payments
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-900 font-medium transition-colors duration-200">
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudentPaymentTable;
