"use client";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import {
  useCreateSemesterFeeInfoMutation,
  useGetSemesterFeeInfoQuery,
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

interface SemesterFeeRecord {
  type: string;
  semester: string;
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

const CreateSemesterFee = () => {
  const [createSemesterFeeInfo, { isLoading }] =
    useCreateSemesterFeeInfoMutation();
  const {
    data,
    refetch,
    isLoading: infoLoading,
  } = useGetSemesterFeeInfoQuery(undefined);

  const createdInfos = data?.data?.data;

  // Group createdInfos by semester and year without duplicates
  const groupedBySemesterYear = useMemo(() => {
    if (!createdInfos || !Array.isArray(createdInfos)) return [];

    const uniqueSemesters: { semester: string; year: string }[] = [];
    const seen = new Set();

    createdInfos.forEach((info) => {
      const key = `${info.semester}-${info.year}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueSemesters.push({
          semester: info.semester,
          year: info.year,
        });
      }
    });

    return uniqueSemesters;
  }, [createdInfos]);

  // Default Semester fee structure (প্রয়োজন অনুযায়ী অ্যামাউন্ট পরিবর্তন করে নিবেন)
  const defaultFeeStructure: FeeStructure = {
    Play: { bangla: 400, english: 500 },
    Nursery: { bangla: 400, english: 500 },
    Kg: { bangla: 0, english: 0 },
    "1": { bangla: 400, english: 0 },
    "2": { bangla: 400, english: 0 },
    "3": { bangla: 600, english: 0 },
    "4": { bangla: 600, english: 0 },
    "5": { bangla: 600, english: 0 },
    "6": { bangla: 800, english: 0 },
    "7": { bangla: 800, english: 0 },
    "8": { bangla: 800, english: 0 },
    "9": { bangla: 0, english: 0 },
    "10": { bangla: 0, english: 0 },
  };

  // Available classes
  const availableClasses: string[] = [
    "Play",
    "Nursery",
    "Kg",
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

  // Available Semesters
  const semesters = useMemo(
    () => ["1st Semester", "2nd Semester", "3rd Semester"],
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
    type: "semesterFee",
    semester: semesters[0],
    year: currentYear.toString(),
    lastDate: "",
  });

  // State for storing all 4 fee records
  const [feeRecords, setFeeRecords] = useState<{
    bangla: { nonCadet: AmountToPaidItem[]; cadet: AmountToPaidItem[] };
    english: { nonCadet: AmountToPaidItem[]; cadet: AmountToPaidItem[] };
  }>({
    bangla: { nonCadet: [], cadet: [] },
    english: { nonCadet: [], cadet: [] },
  });

  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  // Initialize form with current/next date logic
  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15); // Default 15th of next month

    setFormData((prev) => ({
      ...prev,
      semester: semesters[0],
      year: today.getFullYear().toString(),
      lastDate: nextMonth.toISOString().split("T")[0],
    }));

    initializeFeeRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesters]);

  // Initialize all fee records with default amounts
  const initializeFeeRecords = () => {
    const banglaNonCadet = availableClasses.map((className) => ({
      class: className,
      amount: defaultFeeStructure[className]?.bangla || 0,
    }));

    const banglaCadet = availableClasses.map((className) => {
      let amount = defaultFeeStructure[className]?.bangla || 0;
      if (className === "6") amount = 5000; // Special handling for Cadet Class 6 Bangla
      return { class: className, amount };
    });

    const englishNonCadet = availableClasses.map((className) => {
      let amount = defaultFeeStructure[className]?.english || 0;
      if (amount === 0) amount = defaultFeeStructure[className]?.bangla || 0;
      return { class: className, amount };
    });

    const englishCadet = availableClasses.map((className) => {
      let amount = defaultFeeStructure[className]?.english || 0;
      if (className === "6") {
        amount = 12000; // Special handling for Cadet Class 6 English
      } else if (amount === 0) {
        amount = defaultFeeStructure[className]?.bangla || 0;
      }
      return { class: className, amount };
    });

    setFeeRecords({
      bangla: { nonCadet: banglaNonCadet, cadet: banglaCadet },
      english: { nonCadet: englishNonCadet, cadet: englishCadet },
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle amount change for active version
  const handleAmountChange = (index: number, value: string) => {
    const updatedAmounts = [...getActiveAmountList()];
    updatedAmounts[index].amount = parseInt(value) || 0;

    setFeeRecords((prev) => {
      const isBangla = activeVersion === "bangla";
      const targetVersion = isBangla ? prev.bangla : prev.english;
      const updatedSubRecord = activeIsCadet
        ? { ...targetVersion, cadet: updatedAmounts }
        : { ...targetVersion, nonCadet: updatedAmounts };

      return {
        ...prev,
        [isBangla ? "bangla" : "english"]: updatedSubRecord,
      };
    });
  };

  // Handle form submission - create 4 records at once
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const recordsToSubmit: SemesterFeeRecord[] = [
        // Bangla Non-Cadet
        {
          type: "semesterFee",
          semester: formData.semester,
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
          type: "semesterFee",
          semester: formData.semester,
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
          type: "semesterFee",
          semester: formData.semester,
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
          type: "semesterFee",
          semester: formData.semester,
          year: formData.year,
          version: "english",
          isCadet: true,
          lastDate: new Date(formData.lastDate).toISOString(),
          amountToPaid: feeRecords.english.cadet.filter(
            (item) => item.amount > 0,
          ),
        },
      ];

      console.log("Submitting 4 Semester records:", recordsToSubmit);
      const res = await createSemesterFeeInfo(recordsToSubmit).unwrap();
      if (res?.success || res?.data?.success) {
        setMessage({
          type: "success",
          text: "Semester fees created successfully for all versions!",
        });
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
            className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} mb-6`}
          >
            <span>{message.text}</span>
          </div>
        )}

        {/* Existing Created Semester Fees Section */}
        {groupedBySemesterYear.length > 0 && (
          <div className="mb-6">
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body p-4 md:p-6">
                <h2 className="card-title text-lg font-bold mb-4 pb-2 border-b">
                  Already Created Semester Fees
                </h2>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr className="bg-base-200">
                        <th className="font-bold text-gray-700">Semester</th>
                        <th className="font-bold text-gray-700">Year</th>
                        <th className="font-bold text-gray-700">Records</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedBySemesterYear.map((item, index) => {
                        const recordCount =
                          createdInfos?.filter(
                            (info: { semester: string; year: string }) =>
                              info.semester === item.semester &&
                              info.year === item.year,
                          ).length || 0;

                        return (
                          <tr key={index} className="hover:bg-base-100">
                            <td className="font-medium">
                              <div className="badge badge-neutral badge-lg font-bold">
                                {item.semester}
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
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Filters */}
            <div className="lg:w-1/3 space-y-6">
              {/* Basic Information Card */}
              <div className="card bg-base-100 shadow-lg border border-base-300">
                <div className="card-body p-4 md:p-6">
                  <h2 className="card-title text-lg font-bold mb-4 pb-2 border-b">
                    Basic Information
                  </h2>
                  <div className="space-y-4">
                    {/* Semester Selector */}
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-semibold">
                          Semester
                        </span>
                      </label>
                      <select
                        className="select select-bordered w-full select-md"
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        required
                      >
                        {semesters.map((sem) => (
                          <option key={sem} value={sem}>
                            {sem}
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
                          className={`btn btn-sm w-full ${activeVersion === "bangla" ? "btn-primary" : "btn-outline"}`}
                          onClick={() => setActiveVersion("bangla")}
                        >
                          Bangla
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm w-full ${activeVersion === "english" ? "btn-primary" : "btn-outline"}`}
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
                          className={`btn btn-sm w-full ${!activeIsCadet ? "btn-primary" : "btn-outline"}`}
                          onClick={() => setActiveIsCadet(false)}
                        >
                          Non-Cadet
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm w-full ${activeIsCadet ? "btn-primary" : "btn-outline"}`}
                          onClick={() => setActiveIsCadet(true)}
                        >
                          Cadet
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="space-y-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>{" "}
                            Creating 4 Records...
                          </>
                        ) : (
                          <>Create Semester Fees (4 Records)</>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-block"
                        onClick={() => window.history.back()}
                      >
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
                              <div
                                className={`badge ${item.class === "6" ? "badge-warning" : "badge-neutral"} badge-lg font-bold`}
                              >
                                {item.class === "Play" ||
                                item.class === "Nursery"
                                  ? item.class
                                  : item.class === "Kg"
                                    ? "KG"
                                    : `Class ${item.class}`}
                              </div>
                            </td>
                            <td>
                              <span className="text-gray-600 font-medium">
                                {(() => {
                                  let defaultAmount = 0;
                                  if (activeVersion === "bangla") {
                                    defaultAmount =
                                      activeIsCadet && item.class === "6"
                                        ? 5000
                                        : defaultFeeStructure[item.class]
                                            ?.bangla || 0;
                                  } else {
                                    defaultAmount =
                                      activeIsCadet && item.class === "6"
                                        ? 12000
                                        : defaultFeeStructure[item.class]
                                            ?.english ||
                                          defaultFeeStructure[item.class]
                                            ?.bangla ||
                                          0;
                                  }
                                  return `৳${defaultAmount.toLocaleString()}`;
                                })()}
                              </span>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  className="input input-bordered w-32 md:w-40"
                                  value={item.amount}
                                  onChange={(e) =>
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
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSemesterFee;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
