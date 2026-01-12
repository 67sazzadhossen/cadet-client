"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Send,
  CheckCircle,
  XCircle,
  Users,
  User,
  Filter,
  Search,
  Download,
  Phone,
  Smartphone,
  Loader2,
} from "lucide-react";

import {
  useGetAllPhoneNumberQuery,
  useSendSmsToParentsMutation,
} from "@/redux/features/sms/smsApi";

// Type definitions
interface Student {
  id: string;
  studentId: string;
  name: string;
  className: string;
  rollNo: string;
  version: string;
  fatherPhone: string;
  motherPhone: string;
  whatsappNumber: string;
  allPhones: string[];
  selected: boolean;
}

interface ApiStudent {
  id: string;
  studentId: string;
  name: string;
  className: string;
  rollNo: string;
  version: string;
  fatherPhone: string;
  motherPhone: string;
  whatsappNumber: string;
  allPhones: string[];
}

const SendSms = () => {
  const { data, isLoading } = useGetAllPhoneNumberQuery(undefined);
  const studentData = data?.data?.data?.data as ApiStudent[];
  const [students, setStudents] = useState<Student[]>([]);
  const [smsData, setSmsData] = useState({
    message: "",
    selectedClass: "all",
  });
  const [sendSms, { isLoading: sendingSms }] = useSendSmsToParentsMutation();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    selected: 0,
    classCount: 0,
  });

  // API data থেকে students array তৈরি
  useEffect(() => {
    if (studentData && Array.isArray(studentData)) {
      const transformedStudents: Student[] = studentData.map((student) => ({
        id: student.id || `student-${student.studentId}`,
        studentId: student.studentId || student.id,
        name: student.name || "Unknown",
        className: student.className || "N/A",
        rollNo: student.rollNo || "N/A",
        version: student.version || "N/A",
        fatherPhone: student.fatherPhone || "N/A",
        motherPhone: student.motherPhone || "N/A",
        whatsappNumber: student.whatsappNumber || "N/A",
        allPhones: student.allPhones || [],
        selected: false,
      }));

      setStudents(transformedStudents);
    } else {
      setStudents([]);
    }
  }, [studentData]);

  // Get unique classes from real data
  const classes = useMemo(() => {
    if (!students || students.length === 0) return ["all"];

    const uniqueClasses = new Set<string>();
    students.forEach((student) => {
      if (student.className && student.className !== "N/A") {
        uniqueClasses.add(student.className);
      }
    });

    // Class sorting logic
    const sortedClasses = Array.from(uniqueClasses).sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      return a.localeCompare(b);
    });

    return ["all", ...sortedClasses];
  }, [students]);

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    if (!students || students.length === 0) return [];

    return students.filter((student) => {
      // Search matches
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        student.name.toLowerCase().includes(searchLower) ||
        student.rollNo?.toLowerCase().includes(searchLower) ||
        student.fatherPhone.includes(searchTerm) ||
        student.motherPhone.includes(searchTerm) ||
        (student.allPhones &&
          student.allPhones.some((phone) => phone.includes(searchTerm)));

      // Class filter matches
      const matchesClass =
        smsData.selectedClass === "all" ||
        student.className === smsData.selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, smsData.selectedClass]);

  // Update stats
  useEffect(() => {
    if (!students) return;

    const selectedCount = students.filter((s) => s.selected).length;
    const classCount =
      smsData.selectedClass === "all"
        ? students.length
        : students.filter((s) => s.className === smsData.selectedClass).length;

    setStats({
      total: students.length,
      selected: selectedCount,
      classCount: classCount,
    });
  }, [students, smsData.selectedClass]);

  // Handle individual student selection
  const handleSelectStudent = (id: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? { ...student, selected: !student.selected }
          : student
      )
    );
  };

  // Select all filtered students
  const handleSelectAll = () => {
    if (filteredStudents.length === 0) return;

    const allSelected = filteredStudents.every((student) => student.selected);
    setStudents((prev) =>
      prev.map((student) => {
        const isFiltered = filteredStudents.some((s) => s.id === student.id);
        return isFiltered ? { ...student, selected: !allSelected } : student;
      })
    );
  };

  // Select by class
  const handleSelectByClass = (className: string) => {
    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        selected: className === "all" || student.className === className,
      }))
    );
  };

  // Handle class filter change
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const className = e.target.value;
    setSmsData({ ...smsData, selectedClass: className });
  };

  // Send SMS function
  const handleSendSms = async () => {
    const selectedStudents = students.filter((s) => s.selected);

    if (selectedStudents.length === 0) {
      setError("Please select at least one student");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!smsData.message.trim()) {
      setError("Please enter a message");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Student IDs array (এই IDs গুলো message এ যাবে)
      const studentIds = selectedStudents.map((s) => s.id);

      // Student Roll Nos array (যদি roll number ও পাঠাতে চান)
      const studentRollNos = selectedStudents.map((s) => s.rollNo);
      const studentsClasses = selectedStudents.map((s) => s.className);

      // Student Names array
      const studentNames = selectedStudents.map((s) => s.name);

      // WhatsApp numbers array (only valid WhatsApp numbers)
      const whatsappNumbers = selectedStudents
        .filter((s) => s.whatsappNumber && s.whatsappNumber !== "N/A")
        .map((s) => s.whatsappNumber);

      const phoneCount = selectedStudents.reduce(
        (total, student) => total + (student.allPhones?.length || 0),
        0
      );

      // Create message with student IDs
      const finalMessage = smsData.message.trim();

      // SMS Data to send to backend
      const smsPayload = {
        studentIds: studentIds, // Student IDs array (message এ যাবে)
        studentRollNos: studentRollNos, // Roll numbers
        studentsClasses,
        studentNames: studentNames, // Student names
        message: finalMessage, // Message with student info
        selectedCount: selectedStudents.length, // Total selected students
        totalPhones: phoneCount, // Total phone numbers count
        whatsappNumbers: whatsappNumbers, // WhatsApp numbers array
      };

      console.log("SMS Data to send to backend:", smsPayload);

      const res = await sendSms(smsPayload).unwrap();
      console.log("API Response:", res);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Reset form
      setSmsData({ ...smsData, message: "" });
      setStudents((prev) => prev.map((s) => ({ ...s, selected: false })));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.data?.message || "Failed to send SMS. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Download selected contacts
  const handleDownloadContacts = () => {
    const selectedStudents = students.filter((s) => s.selected);

    const csvRows = [
      [
        "Student ID",
        "Name",
        "Class",
        "Roll No",
        "Father Phone",
        "Mother Phone",
        "WhatsApp",
        "All Phones",
      ].join(","),
      ...selectedStudents.map((s) =>
        [
          s.id,
          s.name,
          s.className,
          s.rollNo,
          s.fatherPhone,
          s.motherPhone,
          s.whatsappNumber,
          s.allPhones?.join("; ") || "N/A",
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `students_contacts_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format phone number
  const formatPhoneNumber = (phone: string) => {
    if (!phone || phone === "N/A") return "N/A";
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Send SMS to Parents
        </h1>
        <p className="text-gray-600 mb-6">
          Send SMS messages to parents&apos; contact numbers with student
          information
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <Users className="text-blue-500 mr-3" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <User className="text-green-500 mr-3" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Selected Students</p>
                    <p className="text-2xl font-bold">{stats.selected}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <Filter className="text-purple-500 mr-3" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">
                      {smsData.selectedClass === "all"
                        ? "All Classes"
                        : `Class ${smsData.selectedClass}`}
                    </p>
                    <p className="text-2xl font-bold">{stats.classCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Student List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="relative flex-1">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="Search by name, roll, or phone..."
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSelectAll}
                          disabled={filteredStudents.length === 0}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            filteredStudents.length === 0
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {filteredStudents.length > 0 &&
                          filteredStudents.every((s) => s.selected)
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                        {stats.selected > 0 && (
                          <button
                            onClick={handleDownloadContacts}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm font-medium"
                          >
                            <Download size={16} className="mr-2" />
                            Export ({stats.selected})
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Class Selection Buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {classes.map((cls) => (
                        <button
                          key={cls}
                          onClick={() => handleSelectByClass(cls)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            smsData.selectedClass === cls
                              ? "bg-blue-600 text-white"
                              : cls === "all"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {cls === "all" ? "All Classes" : cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Student List */}
                  <div className="overflow-y-auto max-h-[500px]">
                    {students.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium mb-2">
                          No student data available
                        </p>
                        <p className="text-sm">
                          Please check your API connection
                        </p>
                      </div>
                    ) : filteredStudents.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium mb-2">
                          No students found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3 text-left w-12">
                              <input
                                type="checkbox"
                                checked={
                                  filteredStudents.length > 0 &&
                                  filteredStudents.every((s) => s.selected)
                                }
                                onChange={handleSelectAll}
                                className="rounded h-4 w-4"
                              />
                            </th>
                            <th className="p-3 text-left text-gray-600 text-sm font-medium">
                              Student
                            </th>
                            <th className="p-3 text-left text-gray-600 text-sm font-medium">
                              Class & Roll
                            </th>
                            <th className="p-3 text-left text-gray-600 text-sm font-medium">
                              Contact Numbers
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student) => (
                            <tr
                              key={student.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3">
                                <input
                                  type="checkbox"
                                  checked={student.selected}
                                  onChange={() =>
                                    handleSelectStudent(student.id)
                                  }
                                  className="rounded h-4 w-4"
                                />
                              </td>
                              <td className="p-3">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="font-semibold text-blue-600 text-sm">
                                      {student.name?.charAt(0) || "S"}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {student.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      ID: {student.id}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="space-y-1">
                                  <div className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded inline-block">
                                    {student.className}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Roll: {student.rollNo}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="space-y-2">
                                  {student.fatherPhone &&
                                    student.fatherPhone !== "N/A" && (
                                      <div className="flex items-center text-sm">
                                        <Phone
                                          size={14}
                                          className="text-gray-400 mr-2 flex-shrink-0"
                                        />
                                        <div>
                                          <div className="text-gray-500 text-xs">
                                            Father
                                          </div>
                                          <div className="font-mono">
                                            {formatPhoneNumber(
                                              student.fatherPhone
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  {student.motherPhone &&
                                    student.motherPhone !== "N/A" && (
                                      <div className="flex items-center text-sm">
                                        <Phone
                                          size={14}
                                          className="text-gray-400 mr-2 flex-shrink-0"
                                        />
                                        <div>
                                          <div className="text-gray-500 text-xs">
                                            Mother
                                          </div>
                                          <div className="font-mono">
                                            {formatPhoneNumber(
                                              student.motherPhone
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  {student.allPhones &&
                                    student.allPhones.length > 0 && (
                                      <div className="text-xs text-gray-500 flex items-center">
                                        <Smartphone
                                          size={12}
                                          className="mr-1"
                                        />
                                        {student.allPhones.length} contact(s)
                                      </div>
                                    )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - SMS Form */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Compose SMS
                  </h2>

                  {/* Class Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Class
                    </label>
                    <select
                      value={smsData.selectedClass}
                      onChange={handleClassChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {classes.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls === "all" ? "All Classes" : `Class ${cls}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Box */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message{" "}
                      <span className="text-gray-500">
                        (Max 160 characters)
                      </span>
                    </label>
                    <textarea
                      value={smsData.message}
                      onChange={(e) =>
                        setSmsData({ ...smsData, message: e.target.value })
                      }
                      className="w-full h-40 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Type your message here...
Note: Student IDs will be automatically added to the message."
                      maxLength={160}
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {smsData.message.length}/160 characters
                    </div>
                    <div className="text-xs text-blue-600 mt-2">
                      Selected students&apos; IDs and roll numbers will be
                      automatically appended to the message.
                    </div>
                  </div>

                  {/* Status Messages */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                      <XCircle size={20} className="mr-2 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
                      <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                      <span>SMS sent successfully!</span>
                    </div>
                  )}

                  {/* Selected Summary */}
                  {stats.selected > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-800 mb-2">
                        {stats.selected} student
                        {stats.selected !== 1 ? "s" : ""} selected
                      </div>
                      <div className="text-xs text-blue-600">
                        SMS will be sent to all contact numbers with student IDs
                        included
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        Student IDs:{" "}
                        {students
                          .filter((s) => s.selected)
                          .map((s) => s.id)
                          .join(", ")}
                      </div>
                    </div>
                  )}

                  {/* Send Button */}
                  <button
                    onClick={handleSendSms}
                    disabled={loading || stats.selected === 0}
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-colors ${
                      loading || stats.selected === 0
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} className="mr-2" />
                        Send SMS to {stats.selected} Parent
                        {stats.selected !== 1 ? "s" : ""}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SendSms;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
