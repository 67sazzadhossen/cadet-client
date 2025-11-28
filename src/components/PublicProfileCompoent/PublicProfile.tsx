import React from "react";

import Image from "next/image";
import { MdCastForEducation } from "react-icons/md";
import { TPublicUser } from "@/pages/PublicPages/PublicProfile.types";

const PublicProfile = ({ userData }: { userData: TPublicUser }) => {
  const calculateAge = (dateOfBirth: string) => {
    console.log("Input dateOfBirth:", dateOfBirth);

    const birthDate = new Date(dateOfBirth);
    console.log("Parsed birthDate:", birthDate);
    console.log("Is valid date?", !isNaN(birthDate.getTime()));

    const today = new Date();
    console.log("Today:", today);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    console.log("Initial age:", age);
    console.log("Month difference:", monthDiff);
    console.log(
      "Today date:",
      today.getDate(),
      "Birth date:",
      birthDate.getDate()
    );

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
      console.log("Age after adjustment:", age);
    }

    return age;
  };
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Illustration */}
          <div className="mb-8">
            <svg
              className="w-32 h-32 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            User Not Found
          </h2>

          <p className="text-gray-600 mb-8">
            Sorry, we couldn`t find the user you`re looking for. The user may
            have been removed or the link might be incorrect.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go Back
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Go Home
            </button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-gray-500 mt-8">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8  sm:px-6 lg:px-8">
      <div className="max-w-10/12 mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Cover Photo */}
          <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600"></div>

          {/* Profile Content */}
          <div className="px-2 pb-6">
            {/* Profile Image and Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
              {/* Profile Image */}
              <div className="relative">
                <Image
                  src={userData.image.url}
                  alt={userData.name.englishName}
                  width={120}
                  height={120}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              {/* Name and Designation */}
              <div className="sm:ml-6  md:mt-16 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.name.englishName}
                </h1>
                <p className="text-lg text-gray-600 mb-1">
                  {userData.name.bengaliName}
                </p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                  {userData.designation}
                </span>
              </div>
            </div>

            {/* Main Profile Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6">
                {/* Personal Info Card */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Personal Information
                  </h2>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">
                        Date of Birth
                      </span>
                      <span className="text-gray-900">
                        {formatDate(userData.dateOfBirth)}
                        <span className="text-gray-500 text-sm ml-2">
                          ({calculateAge(userData.dateOfBirth)} years)
                        </span>
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">
                        Blood Group
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {userData.bloodGroup}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Age</span>
                      <span className="text-gray-900">
                        {calculateAge(userData.dateOfBirth)} years
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address Information */}

                {userData.address && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Address
                    </h2>

                    <div className="space-y-2">
                      <div className="flex items-start">
                        <svg
                          className="w-5 h-5 text-gray-400 mr-3 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-gray-900 font-medium capitalize">
                            {userData.address?.address}
                          </p>
                          <p className="text-gray-600 text-sm capitalize">
                            {userData.address?.district}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Qualification Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MdCastForEducation />
                    Qualifications
                  </h2>

                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div>
                        <p className="text-gray-900 font-medium capitalize ml-7">
                          {userData.qualification}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                {/* Contact Card */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <svg
                        className="w-5 h-5 text-gray-400 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-gray-900 font-medium">
                          {userData.contact.email}
                        </p>
                      </div>
                    </div>

                    {userData.contact.mobile && (
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200 ">
                        <svg
                          className="w-5 h-5 text-gray-400 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>

                        <div>
                          <p className="text-sm text-gray-600">Mobile</p>
                          <p className="text-gray-900 font-medium">
                            {userData.contact.mobile}
                          </p>
                        </div>
                      </div>
                    )}

                    {userData.contact.whatsapp && (
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <svg
                          className="w-5 h-5 text-gray-400 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600">WhatsApp</p>
                          <p className="text-gray-900 font-medium">
                            {userData.contact.whatsapp}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
