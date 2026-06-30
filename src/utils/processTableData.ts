import { months } from "@/const/index.const";
import { MonthlyPayment, StudentDataType } from "@/types/index.type";

export const processTableData = (reportData: any): StudentDataType[] => {
  if (!reportData?.students) return [];

  return reportData.students.map((studentGroup: any) => {
    const student = studentGroup.studentInfo;
    const monthlyInfo = studentGroup.monthlyFeeInfo;
    const sessionInfo = studentGroup.sessionFeeInfo;

    const monthlyPaymentsMap: Record<string, MonthlyPayment> = {};

    months.forEach((month) => {
      monthlyPaymentsMap[month] = {
        month,
        amount: 0,
        status: "due",
        breakdown: monthlyInfo?.additionalCharges
          ? {
              itCharge: monthlyInfo.additionalCharges.itCharge,
              electricityBill: monthlyInfo.additionalCharges.electricityBill,
              transportationFee:
                monthlyInfo.additionalCharges.transportationFee,
              othersFee: 0,
              total: 0,
            }
          : undefined,
      };
    });

    if (monthlyInfo?.paidMonths) {
      monthlyInfo.paidMonths.forEach((paidMonth: MonthlyPayment) => {
        monthlyPaymentsMap[paidMonth.month] = {
          ...paidMonth,
          status: "paid",
        };
      });
    }

    if (monthlyInfo?.dueMonths) {
      monthlyInfo.dueMonths.forEach((dueMonth: MonthlyPayment) => {
        if (monthlyPaymentsMap[dueMonth.month]?.status !== "paid") {
          monthlyPaymentsMap[dueMonth.month] = { ...dueMonth, status: "due" };
        }
      });
    }

    return {
      key: student?.id || Math.random().toString(),
      id: student?.id || "N/A",
      nameBangla: student?.name?.bengaliName || "N/A",
      nameEnglish: student?.name?.englishName || "N/A",
      rollNo: student?.rollNo || "N/A",
      class: student?.currentClass || "N/A",
      version: student?.version || "N/A",
      isCadet: student?.isCadet || false,
      waiver: student?.waiver || 0,
      sessionFee: sessionInfo?.sessionFee || 0,
      admissionFee: sessionInfo?.admissionFee || 0,
      sessionTotalRequired: sessionInfo?.totalRequired || 0,
      sessionPaid: sessionInfo?.paidAmount || 0,
      sessionDue: sessionInfo?.dueAmount || 0,
      sessionStatus: sessionInfo?.status || "due",
      monthlyDue: monthlyInfo?.totalDue || 0,
      totalDue: studentGroup.totalDue || 0,
      monthlyPayments: monthlyPaymentsMap,
    };
  });
};
