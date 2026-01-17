// components/Invoice/InvoiceTemplate.ts

interface Student {
  id: string;
  name: {
    englishName: string;
    bengaliName: string;
  };
  currentClass: string;
  rollNo: string;
}

interface PaymentInfo {
  due: number;
  paidAmount: number;
  paybleamount: number;
  status: string;
}

interface ApiResponse {
  student: Student;
  paymentInfo: PaymentInfo;
  monthlyFee: {
    lastDate: Date;
  };
}

export const getInvoiceHTML = (
  studentData: ApiResponse,
  result: {
    paybleamount: number;
    paidAmount: number;
    due: number;
    status: string;
    invoiceNo: string;
  },
) => {
  const numberToWords = (num: number): string => {
    const units = [
      "",
      "এক",
      "দুই",
      "তিন",
      "চার",
      "পাঁচ",
      "ছয়",
      "সাত",
      "আট",
      "নয়",
    ];
    const tens = [
      "",
      "দশ",
      "বিশ",
      "ত্রিশ",
      "চল্লিশ",
      "পঞ্চাশ",
      "ষাট",
      "সত্তর",
      "আশি",
      "নব্বই",
    ];
    const scales = ["", "হাজার", "লক্ষ", "কোটি"];

    if (num === 0) return "শূন্য";

    let words = "";
    let scaleIndex = 0;
    let tempNum = num;

    while (tempNum > 0) {
      const chunk = tempNum % 1000;
      if (chunk !== 0) {
        let chunkWords = "";
        const hundred = Math.floor(chunk / 100);
        const ten = Math.floor((chunk % 100) / 10);
        const unit = chunk % 10;

        if (hundred > 0) chunkWords += units[hundred] + "শ ";
        if (ten > 0) chunkWords += tens[ten] + " ";
        if (unit > 0) chunkWords += units[unit] + " ";

        if (scales[scaleIndex]) chunkWords += scales[scaleIndex] + " ";
        words = chunkWords + words;
      }
      tempNum = Math.floor(tempNum / 1000);
      scaleIndex++;
    }
    return words.trim();
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log(studentData);

  const totalAmount = result.paybleamount;

  const currentDate = new Date();

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Fee Invoice - ${studentData.student.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600&family=Inter:wght@300;400;500&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', 'Noto Sans Bengali', sans-serif;
      font-size: 14px;
      line-height: 1.2;
      color: #000;
      background: #fff;
      padding: 0;
      margin: 0;
      display: flex;
     
    }
 
    
    .invoice-container {
      width: 190mm;
      min-height: 80mm; /* খুবই কম হাইট */
      padding: 3mm;
      border: 1px solid #ddd;
      position: relative;
      page-break-inside: avoid;
      margin: auto;
    }
    
    /* Print Guide */
    .print-guide {
      position: fixed;
      top: 10px;
      right: 10px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      padding: 10px;
      border-radius: 5px;
      font-size: 16px;
      color: #666;
      z-index: 1000;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      max-width: 200px;
    }
    
    /* Header - খুব কম্প্যাক্ট */
    .header {
      text-align: center;
      margin-bottom: 2mm;
      padding-bottom: 1mm;
      border-bottom: 1px solid #000;
    }
    
    .school-name {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 0.5mm;
    }
    
    .school-info {
      font-size: 13px;
      margin-bottom: 1mm;
      color: #666;
    }
    
    .invoice-title {
      font-size: 15px;
      font-weight: 600;
      margin: 1mm 0;
    }
    
    .invoice-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2mm;
      font-size: 13px;
    }
    
    .meta-left, .meta-right {
      display: flex;
      flex-direction: column;
      gap: 0.5mm;
    }
    
    .meta-item {
      display: flex;
      gap: 1mm;
    }
    
    .meta-label {
      font-weight: 600;
      min-width: 20mm;
    }
    
    .meta-value {
      flex: 1;
    }
    
    /* Compact Table */
    .fee-table {
      width: 100%;
      border-collapse: collapse;
      margin: 2mm 0;
      font-size: 13px;
    }
    
    .fee-table th {
      background: #f5f5f5;
      padding: 1mm;
      border: 0.3px solid #000;
      text-align: left;
      font-weight: 600;
    }
    
    .fee-table td {
      padding: 1mm;
      border: 0.3px solid #000;
    }
    
    .fee-table td:first-child {
      width: 80mm;
    }
    
    .fee-table td:last-child {
      text-align: right;
      width: 25mm;
    }
    
    .total-row td {
      font-weight: 700;
      background: #f0f0f0;
    }
    
    .due-row td {
      font-weight: 700;
      background: #fff0f0;
    }
    
    /* Summary - সবচেয়ে কম্প্যাক্ট */
    .summary {
      margin-top: 2mm;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2mm;
      font-size: 13px;
    }
    
    .summary-left {
      display: flex;
      flex-direction: column;
      gap: 0.5mm;
    }
    
    .summary-right {
      display: flex;
      flex-direction: column;
      gap: 0.5mm;
      align-items: flex-end;
    }
    
    .amount-in-words {
      font-size: 12.5px;
      font-style: italic;
      color: #555;
    }
    
    /* Footer - একদম ছোট */
    .footer {
      margin-top: 2mm;
      padding-top: 1mm;
      border-top: 0.5px solid #000;
      font-size: 12px;
      color: #666;
    }
    
   .footer-grid {
  display: flex;
  justify-content: space-between;
 
}

    
    .footer-section h4 {
      font-size: 13px;
      margin-bottom: 0.5mm;
      font-weight: 600;
      color: #333;
    }
    
    .footer-section p {
      margin: 0.3mm 0;
    }
    
    .signature {
      text-align: center;
      margin-top: 3mm;
    }
    
    .signature-line {
      width: 30mm;
      border-top: 0.5px solid #000;
      margin: 1mm auto 0.5mm auto;
    }
    
    /* Print Styles - Browser Header/Footer Remove */
    @media print {
      /* Remove browser default margins and headers/footers */
      @page {
        margin: 40px !important;
        size: auto;
      }
      
      body {
        padding: 0 !important;
        margin: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        display: block !important;
      }
      
      /* Center content on printed page */
      .invoice-container {
        position: absolute !important;
        
        left: 50% !important;
transform: translateX(-50%) !important;
        width: 190mm !important;
        min-height: 80mm !important;
        border: none !important;
        padding: 3mm !important;
        margin: 0 !important;
        box-shadow: none !important;
      }
      
      /* Hide print guide */
      .print-guide {
        display: none !important;
      }
      
      /* Prevent unwanted page breaks */
      .header, .invoice-meta, .fee-table, .summary, .footer {
        page-break-inside: avoid;
        page-break-after: avoid;
      }
      
      /* Force single page */
      html, body {
        height: 297mm !important;
        width: 210mm !important;
        overflow: hidden !important;
      }
    }
    
    /* Helper Classes */
    .text-right {
      text-align: right;
    }
    
    .text-center {
      text-align: center;
    }
    
    .text-bold {
      font-weight: 700;
    }
    
    .mb-05 {
      margin-bottom: 0.5mm;
    }
    
    .mb-1 {
      margin-bottom: 1mm;
    }
    
    .color-red {
      color: #d32f2f;
    }
    
    .color-green {
      color: #388e3c;
    }
  </style>
</head>
<body>
  <div class="print-guide">
    <strong>Print Instructions:</strong><br>
    1. Use "Save as PDF" option<br>
    2. Set margins to "None" or "Minimum"<br>
    3. Disable headers and footers<br>
    4. Check "Background graphics"
  </div>
  
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="school-name">গাজীপুরশাহীন ক্যাডেট একাডেমি ময়মনসিংহ শাখা</div>
      <div class="school-info">ময়মনসিংহ সদর | ফোন: ০১৩০৫-০০৭৭৭৭</div>
      <div class="invoice-title">ফি রসিদ / FEE RECEIPT</div>
    </div>
    
    <!-- Invoice Meta -->
    <div class="invoice-meta">
      <div class="meta-left">
        <div class="meta-item">
          <span class="meta-label">ইনভয়েস নং:</span>
          <span class="meta-value">${result.invoiceNo}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">তারিখ:</span>
          <span class="meta-value">${currentDate.toLocaleDateString(
            "bn-BD",
          )}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">ছাত্র আইডি:</span>
          <span class="meta-value">${studentData.student.id}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">নাম:</span>
          <span class="meta-value">${
            studentData.student.name.englishName
          }</span>
        </div>
      </div>
      <div class="meta-right">
        <div class="meta-item">
          <span class="meta-label">রোল নং:</span>
          <span class="meta-value">${studentData.student.id.slice(-2)}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">ক্লাস:</span>
          <span class="meta-value">${studentData.student.currentClass}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">সর্বশেষ তারিখ:</span>
          <span class="meta-value">${formatDate(
            typeof studentData.monthlyFee.lastDate === "string"
              ? studentData.monthlyFee.lastDate
              : studentData.monthlyFee.lastDate.toISOString(),
          )}
          
          </span>
        </div>
        
      </div>
    </div>
    
    <!-- Fee Table -->
    <table class="fee-table">
      <thead>
        <tr>
          <th>বিবরণ</th>
          <th class="text-right">টাকার পরিমাণ (৳)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>মাসিক বেতন</td>
          <td class="text-right">${result.paybleamount.toFixed(2)}</td>
        </tr>
        <tr>
          <td>বিদ্যুৎ বিল</td>
          <td class="text-right">00.00</td>
        </tr>
        <tr>
          <td>আইটি চার্জ</td>
          <td class="text-right">00.00</td>
        </tr>
        <tr>
          <td>অন্যান্য চার্জ</td>
          <td class="text-right">00.00</td>
        </tr>
        <tr class="total-row">
          <td class="text-bold">সর্বমোট</td>
          <td class="text-right text-bold">${totalAmount.toFixed(2)}</td>
        </tr>
        
    
      </tbody>
    </table>
    
    <!-- Summary -->
    <div class="summary">
      <div class="summary-left">
        <div class="amount-in-words mb-05">
          <span class="text-bold">অঙ্কে লেখা:</span> 
          ${numberToWords(result.due)} টাকা মাত্র
        </div>
        <div class="mb-05">
          <span class="text-bold">পেমেন্ট মেথড:</span> ক্যাশ পেমেন্ট
        </div>
        <div>
          <span class="text-bold">মন্তব্য:</span> বিলম্বে জমা দিলে অতিরিক্ত ৫০ টাকা জরিমানা আরোপ করা হবে
        </div>
      </div>
      <div class="summary-right">
        <div class="mb-05">
          <span class="text-bold">অনুমোদিত স্বাক্ষর:</span>
        </div>
        <div style="margin-top: 8mm; border-bottom: 0.5px solid #000; width: 30mm;"></div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-grid">
        <div class="footer-section">
          <h4>শর্তাবলী:</h4>
          <p>১. রসিদ হারিয়ে গেলে স্কুল দায়ী নয়</p>
          <p>২. এই রসিদ কম্পিউটার দ্বারা তৈরিকৃত</p>
          <p>৩. তারিখ পরিবর্তনের সুযোগ নেই</p>
        </div>
        
        <div class="footer-section">
          <h4>যোগাযোগ:</h4>
          <p>হেল্পলাইন: ০১৩০৫-০০৭৭৭৭</p>
          <p>ইমেইল: gsca.mymensingh@gmail.com</p>
          <p>ওয়েবসাইট: www.gscam.edu.bd</p>
        </div>
        
       
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      // Wait a bit for CSS to load properly
      setTimeout(function() {
        // Auto print
        window.print();
        
        // Close window after print
        setTimeout(function() {
          window.close();
        }, 500);
      }, 300);
    }
  </script>
</body>
</html>
`;
};
