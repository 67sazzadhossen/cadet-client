"use client";

import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { months } from "@/const/index.const";
import { usePaymentHistoryQuery } from "@/redux/features/payment/paymentApi";

const PaymentHistory = () => {
  const { data, isLoading } = usePaymentHistoryQuery({ year: "2026" });
  const paymentData = data?.data?.data;

  if (isLoading)
    return (
      <div className="p-6">
        <LoadingAnimation />
      </div>
    );

  const monthlyData = paymentData?.monthlyFeeHistory || [];
  console.log(monthlyData);

  return (
    <div className="p-4 space-y-6">
      {/* Monthly Fee Section - Mobile Friendly Grid */}
      <section>
        <h2 className="text-lg font-bold mb-3">Monthly Fee History (2026)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {months.map((m) => {
            const payment = monthlyData.find((p: any) => p.month === m);
            return (
              <div
                key={m}
                className={`p-3 rounded-lg border flex flex-col items-center justify-center ${
                  payment
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <span className="text-xs font-semibold text-gray-600 mb-1">
                  {m}
                </span>
                {payment ? (
                  <span className="text-sm font-bold text-green-700">
                    ৳{payment.paidAmount || "Paid"} (Paid)
                  </span>
                ) : (
                  <span className="text-sm font-medium text-red-500">
                    Unpaid
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Annual & Semester Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-bold mb-2">Annual Fees</h3>
          {paymentData?.annualFeeHistory?.length > 0 ? (
            paymentData.annualFeeHistory.map((item: any) => (
              <div
                key={item._id}
                className="flex justify-between border-b border-blue-200 py-2"
              >
                <span>{new Date(item.date).toLocaleDateString()}</span>
                <span className="font-bold text-blue-700 w-32 ">
                  ৳{item.paidAmount}{" "}
                  <span
                    className={
                      item.status === "paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    ({item.status.toUpperCase()})
                  </span>
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No data found</p>
          )}
        </section>

        <section className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="font-bold mb-2">Semester Fees</h3>
          {paymentData?.semesterFeeHistory?.length > 0 ? (
            paymentData.semesterFeeHistory.map((item: any) => (
              <div
                key={item._id}
                className="flex justify-between border-b border-purple-200 py-2"
              >
                <span>{item.month}</span>
                <span className="font-bold text-blue-700 w-32 ">
                  ৳{item.paidAmount}{" "}
                  <span
                    className={
                      item.status === "paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    ({item.status.toUpperCase()})
                  </span>
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No data found</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default PaymentHistory;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
