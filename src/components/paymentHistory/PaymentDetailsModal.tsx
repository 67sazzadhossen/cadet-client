"use client";

import React from "react";
import { StudentWisePayment } from "@/types/payment.types";

interface StudentPaymentTableProps {
  studentWisePayments: StudentWisePayment[];
  onViewDetails: (student: StudentWisePayment) => void;
}

const StudentPaymentTable: React.FC<StudentPaymentTableProps> = ({
  studentWisePayments,
  onViewDetails,
}) => {
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

            const getStudentName = () => {
              if (!studentInfo) return "N/A";
              if (typeof studentInfo.name === "string") return studentInfo.name;
              if (studentInfo.name?.englishName)
                return studentInfo.name.englishName;
              if (studentInfo.name?.bengaliName)
                return studentInfo.name.bengaliName;
              if (studentInfo.firstName)
                return `${studentInfo.firstName} ${studentInfo.lastName || ""}`;
              return "N/A";
            };

            return (
              <tr
                key={studentInfo?._id || studentInfo?.id || Math.random()}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getStudentName()}
                  </div>
                  {studentInfo?.email && (
                    <div className="text-sm text-gray-500">
                      {studentInfo.email}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {studentInfo?.rollNo || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {studentInfo?.currentClass || "N/A"}
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
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        M:{studentPayment.payments.monthly.length}
                      </span>
                    )}
                    {studentPayment.payments?.semester?.length > 0 && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        S:{studentPayment.payments.semester.length}
                      </span>
                    )}
                    {studentPayment.payments?.annual?.length > 0 && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                        A:{studentPayment.payments.annual.length}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onViewDetails(studentPayment)}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
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
