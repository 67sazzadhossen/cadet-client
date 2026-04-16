// types/payment.types.ts
export interface Filters {
  fromDate: string;
  toDate: string;
  exactDate: string;
}

export interface NameType {
  bengaliName?: string;
  englishName?: string;
  firstName?: string;
  lastName?: string;
}

export interface Student {
  _id?: string;
  id?: string;
  name?: string | NameType;
  firstName?: string;
  lastName?: string;
  rollNo?: string;
  currentClass?: string;
  email?: string;
}

export interface Payment {
  _id: string;
  id: string;
  paymentType: string;
  status: "paid" | "partial" | "pending";
  month?: string;
  year?: string;
  date: string;
  totalAmount: number;
  paidAmount: number;
  due: number;
  invoiceNo: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface StudentPayments {
  monthly: Payment[];
  semester: Payment[];
  annual: Payment[];
}

export interface StudentSummary {
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
}

export interface StudentWisePayment {
  student: Student;
  payments: StudentPayments;
  summary: StudentSummary;
}

export interface AmountBreakdown {
  monthly: number;
  semester: number;
  annual: number;
  grandTotal: number;
}

export interface OverallTotals {
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
  totalStudents: number;
}

export interface PaymentSummaryData {
  totalMonthly: number;
  totalSemester: number;
  totalAnnual: number;
  totalPayments: number;
  totalAmount: AmountBreakdown;
  totalPaid: AmountBreakdown;
  totalDue: AmountBreakdown;
  overallTotals: OverallTotals;
}

export interface PaymentHistoryData {
  studentWisePayments: StudentWisePayment[];
  monthlyFees: Payment[];
  semesterFee: Payment[];
  annualFee: Payment[];
  summary: PaymentSummaryData;
}
