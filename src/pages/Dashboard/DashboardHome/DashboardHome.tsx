"use client";

import React from "react";
import {
  BarChart3,
  Users,
  BookOpen,
  UserCheck,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  Bell,
  Search,
} from "lucide-react";
import Link from "next/link";
import { TCurrentUser } from "@/types/index.type";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import Image from "next/image";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";

// Mock data for the dashboard
const statsData = [
  {
    title: "Total Students",
    value: "1,254",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Total Teachers",
    value: "68",
    change: "+5%",
    trend: "up",
    icon: UserCheck,
    color: "bg-green-500",
  },
  {
    title: "Total Classes",
    value: "24",
    change: "+2%",
    trend: "up",
    icon: BookOpen,
    color: "bg-purple-500",
  },
  {
    title: "Revenue",
    value: "৳2,45,000",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    color: "bg-orange-500",
  },
];

const recentActivities = [
  {
    id: 1,
    activity: "New student registration",
    time: "5 min ago",
    type: "student",
  },
  {
    id: 2,
    activity: "Monthly fee collection",
    time: "1 hour ago",
    type: "payment",
  },
  {
    id: 3,
    activity: "Teacher meeting scheduled",
    time: "2 hours ago",
    type: "event",
  },
  {
    id: 4,
    activity: "Sports competition result",
    time: "1 day ago",
    type: "announcement",
  },
  {
    id: 5,
    activity: "Library books updated",
    time: "2 days ago",
    type: "update",
  },
];

const upcomingEvents = [
  { id: 1, event: "Annual Sports Day", date: "2024-03-15", type: "sports" },
  {
    id: 2,
    event: "Parent-Teacher Meeting",
    date: "2024-03-20",
    type: "meeting",
  },
  { id: 3, event: "Science Fair", date: "2024-03-25", type: "academic" },
  { id: 4, event: "Final Exams Begin", date: "2024-04-01", type: "exam" },
];

const quickActions = [
  {
    title: "Add Admin",
    icon: Users,
    link: "/dashboard/create-admin",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Add Student",
    icon: Users,
    link: "/students/create",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Add Teacher",
    icon: UserCheck,
    link: "/teachers/create",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Take Attendance",
    icon: Calendar,
    link: "/attendance",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Fee Collection",
    icon: DollarSign,
    link: "/fees",
    color: "bg-orange-100 text-orange-600",
  },
];

const DashboardHome = () => {
  const { data, isLoading } = useGetMeQuery(undefined);
  const currentUserData: TCurrentUser = data?.data?.data;
  console.log(currentUserData);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to School Management System</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <Image
                className="w-10 h-10 rounded-full"
                src={currentUserData.image.url}
                alt={currentUserData.name.englishName}
                height={40}
                width={40}
              />
              <div>
                <p className="font-medium text-gray-900">
                  {currentUserData.name.englishName}
                </p>
                <p className="text-sm text-gray-500">
                  {currentUserData.designation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <div
                    className={`flex items-center mt-2 ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">
                      {stat.change} from last month
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link
                    href={action.link}
                    key={index}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg ${action.color} hover:opacity-90 transition-opacity`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{action.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Student Performance
              </h2>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  Performance chart will be displayed here
                </p>
                <p className="text-sm text-gray-400">
                  Integration with chart library required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activities
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "student"
                      ? "bg-blue-500"
                      : activity.type === "payment"
                      ? "bg-green-500"
                      : activity.type === "event"
                      ? "bg-purple-500"
                      : activity.type === "announcement"
                      ? "bg-orange-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-gray-900">{activity.activity}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Events
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Calendar
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{event.event}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.type === "sports"
                      ? "bg-blue-100 text-blue-800"
                      : event.type === "meeting"
                      ? "bg-green-100 text-green-800"
                      : event.type === "academic"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">
              Important Notifications
            </h3>
            <p className="text-yellow-700 mt-1">
              • Monthly staff meeting scheduled for tomorrow at 10:00 AM in the
              conference room.
            </p>
            <p className="text-yellow-700">
              • Fee submission deadline for March is approaching. Please remind
              students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
