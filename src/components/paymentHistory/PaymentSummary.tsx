"use client";

import React from "react";

// Strict type definitions
interface AmountBreakdown {
  monthly: number;
  semester: number;
  annual: number;
  grandTotal: number;
}

interface PaymentSummaryData {
  totalMonthly: number;
  totalSemester: number;
  totalAnnual: number;
  totalPayments: number;
  totalAmount: AmountBreakdown;
  totalPaid: AmountBreakdown;
  totalDue: AmountBreakdown;
  overallTotals: {
    totalAmount: number;
    totalPaid: number;
    totalDue: number;
    totalStudents: number;
  };
}

interface PaymentSummaryProps {
  summary: PaymentSummaryData;
}

interface SummaryCard {
  title: string;
  value: number | string;
  color: string;
  icon: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ summary }) => {
  // Validate summary data
  if (!summary || typeof summary !== "object") {
    return (
      <div className="text-center py-8 text-red-600">
        Invalid payment summary data
      </div>
    );
  }

  const summaryCards: SummaryCard[] = [
    {
      title: "Total Payments",
      value: summary.totalPayments ?? 0,
      color: "bg-blue-500",
      icon: "📊",
    },
    {
      title: "Total Amount",
      value: `৳${(summary.totalAmount?.grandTotal ?? 0).toLocaleString()}`,
      color: "bg-green-500",
      icon: "💰",
    },
    {
      title: "Total Paid",
      value: `৳${(summary.totalPaid?.grandTotal ?? 0).toLocaleString()}`,
      color: "bg-purple-500",
      icon: "✅",
    },
    {
      title: "Total Due",
      value: `৳${(summary.totalDue?.grandTotal ?? 0).toLocaleString()}`,
      color: "bg-red-500",
      icon: "⚠️",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div
                className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentSummary;
