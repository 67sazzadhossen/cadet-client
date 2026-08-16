"use client";

import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { DashboardButton, DashboardField, DashboardPageShell, DashboardTable, DashboardToolbar } from "@/components/dashboard/GlassUI";
import { monthMap } from "@/const/index.const";
import { useGetRoleAttendanceQuery } from "@/redux/features/attendance/attendanceApi";
import { useEffect, useMemo, useState } from "react";

type AttendanceRole = "student" | "teacher";
type AttendanceRecord = { date: string; status: "in" | "out"; time?: string };
type RoleAttendanceUser = {
  userId: string;
  userName: string;
  roll?: string | number;
  currentClass?: string;
  designation?: string;
  attendance: AttendanceRecord[];
};

const formatTime = (value?: string) => {
  if (!value) return "-";
  const [hours, minutes] = value.split(":");
  const hour = Number(hours);
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
};

export default function RoleAttendance({ role }: { role: AttendanceRole }) {
  const pageSize = 30;
  const now = new Date();
  const currentYear = now.getFullYear();
  const [month, setMonth] = useState(now.toLocaleString("default", { month: "long" }).toLowerCase());
  const [year, setYear] = useState(String(now.getFullYear()));
  const [search, setSearch] = useState("");
  const [showTime, setShowTime] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetRoleAttendanceQuery({ role, month, year });
  const users: RoleAttendanceUser[] = data?.data?.data || [];
  const filtered = users.filter((user) =>
    [user.userName, user.userId, user.roll, user.currentClass, user.designation]
      .filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedUsers = filtered.slice((page - 1) * pageSize, page * pageSize);
  const monthIndex = Object.keys(monthMap).indexOf(month);
  const days = new Date(Number(year), monthIndex + 1, 0).getDate();
  const years = useMemo(() => Array.from({ length: 5 }, (_, i) => String(currentYear - i)), [currentYear]);
  const title = role === "student" ? "Students Attendance" : "Teachers Attendance";

  useEffect(() => {
    setPage(1);
  }, [search, month, year, role]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  if (isLoading) return <LoadingAnimation />;

  return (
    <DashboardPageShell title={title} description={`Monthly attendance for all active ${role}s`}>
      <DashboardToolbar>
        <DashboardField label="Month">
          <select className="dashboard-input uppercase" value={month} onChange={(e) => setMonth(e.target.value)}>
            {Object.keys(monthMap).map((item) => <option key={item}>{item}</option>)}
          </select>
        </DashboardField>
        <DashboardField label="Year">
          <select className="dashboard-input" value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((item) => <option key={item}>{item}</option>)}
          </select>
        </DashboardField>
        <DashboardField label={`Search ${role}`}>
          <input className="dashboard-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, ID, roll, class..." />
        </DashboardField>
        <DashboardButton tone="muted" onClick={() => setShowTime((value) => !value)}>
          {showTime ? "Status view" : "Time view"}
        </DashboardButton>
      </DashboardToolbar>

      <DashboardTable className="max-h-[72vh] overflow-x-scroll overflow-y-auto [scrollbar-gutter:stable]">
        {isFetching && <div className="p-2 text-xs text-blue-200">Refreshing attendance…</div>}
        <table className="min-w-max border-separate border-spacing-0 text-xs">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className="sticky left-0 z-30 min-w-52 p-3 text-left">{role === "student" ? "Student" : "Teacher"}</th>
              {Array.from({ length: days }, (_, index) => <th className="min-w-12 p-2 text-center" key={index}>{index + 1}</th>)}
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.userId}>
                <td className="sticky left-0 z-10 bg-blue-950/90 p-3">
                  <strong className="block text-white">{user.userName}</strong>
                  <span className="text-[10px] text-blue-200/70">{user.userId}{user.currentClass ? ` · Class ${user.currentClass}` : ""}{user.roll ? ` · Roll ${user.roll}` : ""}</span>
                </td>
                {Array.from({ length: days }, (_, index) => {
                  const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`;
                  const records = user.attendance.filter((item) => item.date === date);
                  const checkIn = records.find((item) => item.status === "in");
                  const checkOut = records.find((item) => item.status === "out");
                  const friday = new Date(Number(year), monthIndex, index + 1).getDay() === 5;
                  return <td className="border p-2 text-center" key={date}>
                    {friday ? <span className="text-blue-300">F</span> : showTime ? (
                      <span className="whitespace-nowrap text-[10px]"><b className="text-emerald-300">{formatTime(checkIn?.time)}</b><br/><b className="text-red-300">{formatTime(checkOut?.time)}</b></span>
                    ) : <span className={`inline-flex rounded-full px-2 py-1 font-bold ${checkIn ? "bg-emerald-400/20 text-emerald-200" : "bg-red-400/20 text-red-200"}`}>{checkIn ? "P" : "A"}</span>}
                  </td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <p className="p-8 text-center text-blue-100/70">No {role} attendance found.</p>}
      </DashboardTable>

      <div className="dashboard-glass flex flex-col gap-2 px-4 py-3 text-xs text-blue-100 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {filtered.length
            ? `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length}`
            : "Showing 0 records"}
          {search && ` matching “${search}” across all ${users.length} records`}
        </span>
        <div className="flex items-center gap-2">
          <DashboardButton tone="muted" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
            Previous
          </DashboardButton>
          <span className="min-w-20 text-center">Page {page} / {totalPages}</span>
          <DashboardButton tone="muted" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>
            Next
          </DashboardButton>
        </div>
      </div>
    </DashboardPageShell>
  );
}
