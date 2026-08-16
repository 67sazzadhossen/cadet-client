import { months } from "@/const/index.const";
import { message } from "antd";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const handleExportExcel = async (
  tableData: any[],
  selectedClass: string,
  selectedYear: string,
) => {
  if (!tableData?.length) {
    message.warning("No data available to export");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Fee Reports");

  const headers = [
    "Student ID",
    "Student Name",
    "Roll",
    "Class",
    "Waiver",
    ...months.map((m) => m.substring(0, 3).toUpperCase()),
    "Session Fee Required",
    "Session Fee Paid",
    "Session Fee Due",
    "Total Due",
  ];

  worksheet.addRow(headers);

  // Header Style
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2563EB" },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
  });

  tableData.forEach((student) => {
    const rowData: any[] = [
      student.id,
      student.nameEnglish,
      student.rollNo,
      student.class,
      `${student.waiver}%`,
    ];

    months.forEach((month) => {
      const payment = student.monthlyPayments[month];

      if (!payment) {
        rowData.push("-");
        return;
      }

      rowData.push(
        payment.status === "paid" ? (payment.paidAmount ?? payment.amount) : 0,
      );
    });

    rowData.push(
      student.sessionTotalRequired,
      student.sessionPaid,
      student.sessionDue,
      student.totalDue,
    );

    const row = worksheet.addRow(rowData);

    // Month column style (F-Q)
    months.forEach((_, index) => {
      const cell = row.getCell(index + 6);
      const payment = student.monthlyPayments[months[index]];

      if (!payment) return;

      if (payment.status === "paid") {
        cell.font = {
          bold: true,
          color: { argb: "008000" }, // Green
        };
      } else {
        cell.font = {
          bold: true,
          color: { argb: "FF0000" }, // Red
        };
      }

      cell.alignment = {
        horizontal: "center",
      };
    });
  });

  worksheet.columns.forEach((column) => {
    column.width = 16;
  });

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),
    `Fee_Report_${selectedClass || "All"}_${selectedYear}_${dayjs().format("YYYY-MM-DD")}.xlsx`,
  );

  message.success("Excel report exported successfully!");
};
