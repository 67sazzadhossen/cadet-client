"use client";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import {
  useCreateMonthlyPaymentInfoMutation,
  useGetMonthlyPaymentInfoQuery,
} from "@/redux/features/accounts/accountsApi";
import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useMemo,
} from "react";

// Define types
interface FeeStructure {
  [key: string]: {
    bangla: number;
    english: number;
  };
}

interface AmountToPaidItem {
  class: string;
  amount: number;
}

interface MonthlyFeeRecord {
  type: string;
  month: string;
  year: string;
  version: "bangla" | "english";
  isCadet: boolean;
  lastDate: string;
  amountToPaid: AmountToPaidItem[];
}

interface Message {
  type: "success" | "error" | "";
  text: string;
}

const CreateMonthlyFee = () => {
  const [createMonthlyFeeInfo, { isLoading }] =
    useCreateMonthlyPaymentInfoMutation();
  const {
    data,
    refetch,
    isLoading: infoLoading,
  } = useGetMonthlyPaymentInfoQuery(undefined);
  const createdInfos = data?.data?.data;
  console.log(createdInfos);

  // Group createdInfos by month and year without duplicates
  const groupedByMonthYear = useMemo(() => {
    if (!createdInfos || !Array.isArray(createdInfos)) return [];

    const uniqueMonths: { month: string; year: string }[] = [];
    const seen = new Set();

    createdInfos.forEach((info) => {
      const key = `${info.month}-${info.year}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueMonths.push({
          month: info.month,
          year: info.year,
        });
      }
    });

    return uniqueMonths;
  }, [createdInfos]);

  // Default fee structure
  const defaultFeeStructure: FeeStructure = {
    play: { bangla: 1000, english: 2000 },
    nursery: { bangla: 1100, english: 2000 },
    kg: { bangla: 0, english: 2100 },
    "1": { bangla: 1200, english: 2200 },
    "2": { bangla: 1200, english: 2200 },
    "3": { bangla: 1400, english: 2500 },
    "4": { bangla: 1500, english: 2700 },
    "5": { bangla: 1600, english: 3000 },
    "6": { bangla: 1700, english: 0 },
    "7": { bangla: 1800, english: 0 },
    "8": { bangla: 1900, english: 0 },
    "9": { bangla: 2000, english: 0 },
    "10": { bangla: 2000, english: 0 },
  };

  // Available classes
  const availableClasses: string[] = [
    "play",
    "nursery",
    "kg",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ];

  // Available months
  const months = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    [],
  );

  // Available years
  const currentYear = new Date().getFullYear();
  const years: string[] = Array.from({ length: 5 }, (_, i) =>
    (currentYear + i).toString(),
  );

  // State for selecting which version to edit
  const [activeVersion, setActiveVersion] = useState<"bangla" | "english">(
    "bangla",
  );
  const [activeIsCadet, setActiveIsCadet] = useState<boolean>(false);

  // State for form data
  const [formData, setFormData] = useState({
    type: "monthlyFee",
    month: months[0],
    year: currentYear.toString(),
    lastDate: "",
  });

  // State for storing all 4 fee records
  const [feeRecords, setFeeRecords] = useState<{
    bangla: {
      nonCadet: AmountToPaidItem[];
      cadet: AmountToPaidItem[];
    };
    english: {
      nonCadet: AmountToPaidItem[];
      cadet: AmountToPaidItem[];
    };
  }>({
    bangla: {
      nonCadet: [],
      cadet: [],
    },
    english: {
      nonCadet: [],
      cadet: [],
    },
  });

  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  // Initialize form with current month and next 10th date
  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 10);

    setFormData((prev) => ({
      ...prev,
      month: months[today.getMonth()],
      year: today.getFullYear().toString(),
      lastDate: nextMonth.toISOString().split("T")[0],
    }));

    // Initialize all fee records with default amounts
    initializeFeeRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [months]);

  // Initialize all fee records with default amounts
  const initializeFeeRecords = () => {
    const banglaNonCadet = availableClasses.map((className) => {
      const amount = defaultFeeStructure[className]?.bangla || 0;
      return { class: className, amount };
    });

    const banglaCadet = availableClasses.map((className) => {
      let amount = defaultFeeStructure[className]?.bangla || 0;
      // Special handling for class 6 cadet (bangla)
      if (className === "6") {
        amount = 2500; // Cadet bangla version for class 6
      }
      return { class: className, amount };
    });

    const englishNonCadet = availableClasses.map((className) => {
      let amount = defaultFeeStructure[className]?.english || 0;
      // If english version is 0, use bangla as default
      if (amount === 0) {
        amount = defaultFeeStructure[className]?.bangla || 0;
      }
      return { class: className, amount };
    });

    const englishCadet = availableClasses.map((className) => {
      let amount = defaultFeeStructure[className]?.english || 0;
      // Special handling for class 6 cadet (english)
      if (className === "6") {
        amount = 6000; // Cadet english version for class 6
      } else if (amount === 0) {
        amount = defaultFeeStructure[className]?.bangla || 0;
      }
      return { class: className, amount };
    });

    setFeeRecords({
      bangla: {
        nonCadet: banglaNonCadet,
        cadet: banglaCadet,
      },
      english: {
        nonCadet: englishNonCadet,
        cadet: englishCadet,
      },
    });
  };

  // Get current active amount list
  const getActiveAmountList = (): AmountToPaidItem[] => {
    if (activeVersion === "bangla") {
      return activeIsCadet
        ? feeRecords.bangla.cadet
        : feeRecords.bangla.nonCadet;
    } else {
      return activeIsCadet
        ? feeRecords.english.cadet
        : feeRecords.english.nonCadet;
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle amount change for active version
  const handleAmountChange = (index: number, value: string) => {
    const updatedAmounts = [...getActiveAmountList()];
    updatedAmounts[index].amount = parseInt(value) || 0;

    // Update the fee records
    setFeeRecords((prev) => {
      if (activeVersion === "bangla") {
        if (activeIsCadet) {
          return {
            ...prev,
            bangla: {
              ...prev.bangla,
              cadet: updatedAmounts,
            },
          };
        } else {
          return {
            ...prev,
            bangla: {
              ...prev.bangla,
              nonCadet: updatedAmounts,
            },
          };
        }
      } else {
        if (activeIsCadet) {
          return {
            ...prev,
            english: {
              ...prev.english,
              cadet: updatedAmounts,
            },
          };
        } else {
          return {
            ...prev,
            english: {
              ...prev.english,
              nonCadet: updatedAmounts,
            },
          };
        }
      }
    });
  };

  // Handle form submission - create 4 records
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Prepare 4 records to submit
      const recordsToSubmit: MonthlyFeeRecord[] = [
        // Bangla Non-Cadet
        {
          type: "monthlyFee",
          month: formData.month,
          year: formData.year,
          version: "bangla",
          isCadet: false,
          lastDate: new Date(formData.lastDate).toISOString(),
          amountToPaid: feeRecords.bangla.nonCadet.filter(
            (item) => item.amount > 0,
          ),
        },
        // Bangla Cadet
        {
          type: "monthlyFee",
          month: formData.month,
          year: formData.year,
          version: "bangla",
          isCadet: true,
          lastDate: new Date(formData.lastDate).toISOString(),
          amountToPaid: feeRecords.bangla.cadet.filter(
            (item) => item.amount > 0,
          ),
        },
        // English Non-Cadet
        {
          type: "monthlyFee",
          month: formData.month,
          year: formData.year,
          version: "english",
          isCadet: false,
          lastDate: new Date(formData.lastDate).toISOString(),
          amountToPaid: feeRecords.english.nonCadet.filter(
            (item) => item.amount > 0,
          ),
        },
        // English Cadet
        {
          type: "monthlyFee",
          month: formData.month,
          year: formData.year,
          version: "english",
          isCadet: true,
          lastDate: new Date(formData.lastDate).toISOString(),
          amountToPaid: feeRecords.english.cadet.filter(
            (item) => item.amount > 0,
          ),
        },
      ];

      console.log("Submitting 4 records:", recordsToSubmit);
      const res = await createMonthlyFeeInfo(recordsToSubmit).unwrap();
      if (res.data.success) {
        refetch();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    }
  };
  if (isLoading || infoLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-6">
      <div className="mx-auto">
        {/* Message Display */}
        {message.text && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-error"
            } mb-6`}
          >
            <span>{message.text}</span>
          </div>
        )}

        {/* Existing Created Fees Section - NEW ADDITION */}
        {groupedByMonthYear.length > 0 && (
          <div className="mb-6">
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body p-4 md:p-6">
                <h2 className="card-title text-lg font-bold mb-4 pb-2 border-b">
                  Already Created Monthly Fees
                </h2>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr className="bg-base-200">
                        <th className="font-bold text-gray-700">Month</th>
                        <th className="font-bold text-gray-700">Year</th>
                        <th className="font-bold text-gray-700">Records</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedByMonthYear.map((item, index) => {
                        // Count how many records exist for this month-year combination
                        const recordCount =
                          createdInfos?.filter(
                            (info: { month: string; year: string }) =>
                              info.month === item.month &&
                              info.year === item.year,
                          ).length || 0;

                        return (
                          <tr key={index} className="hover:bg-base-100">
                            <td className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="badge badge-neutral badge-lg font-bold">
                                  {item.month}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="text-gray-600 font-medium">
                                {item.year}
                              </span>
                            </td>
                            <td>
                              <span className="text-gray-600 font-medium">
                                {recordCount} Records
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Layout Container */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Filters (Fixed Position) */}
            <div className="lg:w-1/3 space-y-6">
              {/* Basic Information Card */}
              <div className="card bg-base-100 shadow-lg border border-base-300">
                <div className="card-body p-4 md:p-6">
                  <h2 className="card-title text-lg font-bold mb-4 pb-2 border-b">
                    Basic Information
                  </h2>

                  <div className="space-y-4">
                    {/* Month Selector */}
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-semibold">Month</span>
                      </label>
                      <select
                        className="select select-bordered w-full select-md"
                        name="month"
                        value={formData.month}
                        onChange={handleInputChange}
                        required
                      >
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Year Selector */}
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-semibold">Year</span>
                      </label>
                      <select
                        className="select select-bordered w-full select-md"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        required
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Last Date */}
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-semibold">
                          Last Date for Payment
                        </span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered w-full input-md"
                        name="lastDate"
                        value={formData.lastDate}
                        onChange={handleInputChange}
                        required
                      />
                      <label className="label py-1">
                        <span className="label-text-alt text-gray-500 text-xs">
                          Last date to pay without late fee
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Type Filter Card */}
              <div className="card w-full bg-base-100 shadow-lg border border-base-300">
                <div className="card-body p-4 md:p-6">
                  <h2 className="card-title text-lg font-bold mb-4 pb-2 border-b">
                    Select Fee Type
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Version Selector */}
                    <div>
                      <label className="label-text font-semibold block mb-2">
                        Version
                      </label>
                      <div className="space-y-2">
                        <button
                          type="button"
                          className={`btn btn-sm w-full ${
                            activeVersion === "bangla"
                              ? "btn-primary"
                              : "btn-outline"
                          }`}
                          onClick={() => setActiveVersion("bangla")}
                        >
                          Bangla
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm w-full ${
                            activeVersion === "english"
                              ? "btn-primary"
                              : "btn-outline"
                          }`}
                          onClick={() => setActiveVersion("english")}
                        >
                          English
                        </button>
                      </div>
                    </div>

                    {/* Cadet Status Selector */}
                    <div>
                      <label className="label-text font-semibold block mb-2">
                        Cadet Status
                      </label>
                      <div className="space-y-2">
                        <button
                          type="button"
                          className={`btn btn-sm w-full ${
                            !activeIsCadet ? "btn-primary" : "btn-outline"
                          }`}
                          onClick={() => setActiveIsCadet(false)}
                        >
                          Non-Cadet
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm w-full ${
                            activeIsCadet ? "btn-primary" : "btn-outline"
                          }`}
                          onClick={() => setActiveIsCadet(true)}
                        >
                          Cadet
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button (Moved Here) */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="space-y-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Creating 4 Records...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            Create Monthly Fees (4 Records)
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline btn-block"
                        onClick={() => window.history.back()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Amount Table */}
            <div className="lg:w-2/3">
              <div className="card bg-base-100 shadow-lg border border-base-300">
                <div className="card-body p-4 md:p-6">
                  {/* Table Header */}

                  {/* Amount Table */}
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr className="bg-base-200">
                          <th className="font-bold text-gray-700">Class</th>
                          <th className="font-bold text-gray-700">
                            Default Value
                          </th>
                          <th className="font-bold text-gray-700">
                            Amount (৳)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getActiveAmountList().map((item, index) => (
                          <tr key={index} className="hover:bg-base-100">
                            <td className="font-medium">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`badge ${
                                    item.class === "6"
                                      ? "badge-warning"
                                      : "badge-neutral"
                                  } badge-lg font-bold`}
                                >
                                  {item.class === "play"
                                    ? "Play"
                                    : item.class === "nursery"
                                      ? "Nursery"
                                      : item.class === "kg"
                                        ? "KG"
                                        : `Class ${item.class}`}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="text-gray-600 font-medium">
                                {(() => {
                                  let defaultAmount = 0;
                                  if (activeVersion === "bangla") {
                                    if (activeIsCadet) {
                                      defaultAmount =
                                        item.class === "6"
                                          ? 2500
                                          : defaultFeeStructure[item.class]
                                              ?.bangla || 0;
                                    } else {
                                      defaultAmount =
                                        defaultFeeStructure[item.class]
                                          ?.bangla || 0;
                                    }
                                  } else {
                                    if (activeIsCadet) {
                                      defaultAmount =
                                        item.class === "6"
                                          ? 6000
                                          : defaultFeeStructure[item.class]
                                              ?.english || 0;
                                      if (
                                        defaultAmount === 0 &&
                                        item.class !== "6"
                                      ) {
                                        defaultAmount =
                                          defaultFeeStructure[item.class]
                                            ?.bangla || 0;
                                      }
                                    } else {
                                      defaultAmount =
                                        defaultFeeStructure[item.class]
                                          ?.english || 0;
                                      if (defaultAmount === 0) {
                                        defaultAmount =
                                          defaultFeeStructure[item.class]
                                            ?.bangla || 0;
                                      }
                                    }
                                  }
                                  return `৳${defaultAmount.toLocaleString()}`;
                                })()}
                              </span>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  className="input input-bordered w-32 md:w-40 focus:ring-2 focus:ring-primary focus:border-primary"
                                  value={item.amount}
                                  onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                  ) =>
                                    handleAmountChange(index, e.target.value)
                                  }
                                  min="0"
                                  required
                                />
                                <span className="text-gray-500">৳</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Important Notes */}
                  <div className="mt-8">
                    <div className="collapse collapse-plus border border-base-300">
                      <input type="checkbox" />
                      <div className="collapse-title font-bold text-gray-700">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Important Notes & Instructions
                        </div>
                      </div>
                      <div className="collapse-content">
                        <div className="space-y-3 text-sm text-gray-600 pt-4">
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="font-semibold text-yellow-800">
                              • Class 6 Cadet students have special fee
                              structure:
                            </p>
                            <ul className="list-disc list-inside ml-4 mt-1">
                              <li>Cadet English Version: 6000 ৳</li>
                              <li>Cadet Bangla Version: 2500 ৳</li>
                            </ul>
                          </div>
                          <p>
                            • For classes 7-10, English version is not available
                            in the default structure (will use Bangla amount).
                          </p>
                          <p>
                            • The last date should be at least 10 days from
                            today.
                          </p>
                          <p>
                            • You can modify amounts for each version separately
                            using the filters.
                          </p>
                          <p className="font-semibold">
                            • Submit button will create all 4 fee records at
                            once.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMonthlyFee;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
