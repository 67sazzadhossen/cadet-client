"use client";

import { TMutationTrigger, TTeacher } from "@/types/index.type";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FiEdit, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";

const Table = ({
  data,
  refetch,
  deleteUser,
  isLoading,
}: {
  data: TTeacher[];
  refetch: () => void;
  deleteUser: TMutationTrigger;
  isLoading: boolean;
}) => {
  const [selectedUser, setSelectedUser] = useState<TTeacher | null>(null);

  const handleView = (user: TTeacher) => {
    setSelectedUser(user);
    const modal = document.getElementById("view_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) {
      return;
    }

    try {
      const res = await deleteUser(id);
      if (res.error) {
        alert("Failed to delete teacher");
      } else {
        refetch();
        alert("Teacher deleted successfully");
      }
    } catch (error) {
      console.log(error);
      alert("Error deleting teacher");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr className="bg-gray-50">
                <th className="font-bold">Name</th>
                <th className="font-bold">ID</th>
                <th className="font-bold">Contact</th>
                <th className="font-bold">Designation</th>
                <th className="font-bold">Subjects</th>
                <th className="font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user._id?.toString()} className="hover:bg-gray-50">
                  <td className="">
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          {user.image?.url ? (
                            <Image
                              src={user.image.url}
                              alt={user.name.englishName}
                              width={48}
                              height={48}
                              className="object-cover w-12 h-12"
                            />
                          ) : (
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                              {user.name.englishName.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{user.name.englishName}</div>
                        <div className="text-sm text-gray-500 uppercase">
                          {user.name.bengaliName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-mono text-sm">{user.id}</div>
                  </td>
                  <td>
                    <div className="text-sm">
                      <div>{user.contact.email}</div>
                      <div className="text-gray-500">{user.contact.mobile}</div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline badge-primary">
                      {user.designation}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {user.subjects?.slice(0, 2).map((subject, index) => (
                        <span
                          key={index}
                          className="badge badge-ghost badge-sm"
                        >
                          {subject}
                        </span>
                      ))}
                      {user.subjects && user.subjects.length > 2 && (
                        <span className="badge badge-ghost badge-sm">
                          +{user.subjects.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      {/* View Button */}
                      <button
                        onClick={() => handleView(user)}
                        className="btn btn-ghost btn-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>

                      {/* Edit Button */}
                      <Link
                        href={`/dashboard/teachers/edit/${user._id}`}
                        className="btn btn-ghost btn-sm text-green-600 hover:text-green-800 hover:bg-green-50"
                        title="Edit Teacher"
                      >
                        <FiEdit className="w-4 h-4" />
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn btn-ghost btn-sm text-red-600 hover:text-red-800 hover:bg-red-50"
                        title="Delete Teacher"
                        disabled={isLoading}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FiPlus className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No teachers found
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by adding your first teacher
              </p>
              <Link
                href="/dashboard/teachers/create"
                className="btn btn-primary"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Teacher
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      <dialog id="view_modal" className="modal">
        <div className="modal-box max-w-4xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          {selectedUser && (
            <div>
              <h3 className="font-bold text-lg mb-6">Teacher Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">
                    Personal Information
                  </h4>

                  <div className="flex items-center space-x-4">
                    {selectedUser.image?.url ? (
                      <Image
                        src={selectedUser.image.url}
                        alt={selectedUser.name.englishName}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {selectedUser.name.englishName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-lg">
                        {selectedUser.name.englishName}
                      </p>
                      <p className="text-gray-600">
                        {selectedUser.name.bengaliName}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {selectedUser.id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="font-medium">Email:</label>
                      <p>{selectedUser.contact.email}</p>
                    </div>
                    <div>
                      <label className="font-medium">Phone:</label>
                      <p>{selectedUser.contact.mobile}</p>
                    </div>
                    <div>
                      <label className="font-medium">WhatsApp:</label>
                      <p>{selectedUser.contact.whatsapp || "N/A"}</p>
                    </div>
                    <div>
                      <label className="font-medium">Date of Birth:</label>
                      <p>
                        {new Date(
                          selectedUser.dateOfBirth
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium">Blood Group:</label>
                      <p>{selectedUser.bloodGroup}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">
                    Professional Information
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div>
                      <label className="font-medium">Designation:</label>
                      <p className="badge badge-outline badge-primary mt-1">
                        {selectedUser.designation}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium">Subjects:</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedUser.subjects?.map((subject, index) => (
                          <span
                            key={index}
                            className="badge badge-ghost badge-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="font-medium">Qualification:</label>
                      <p>{selectedUser.qualification}</p>
                    </div>
                    <div>
                      <label className="font-medium">Joining Date:</label>
                      <p>
                        {new Date(
                          selectedUser.joiningDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">
                    Address Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <label className="font-medium block">Address:</label>
                      <p className="p-3 bg-gray-50 rounded-lg">
                        {selectedUser.address.address}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium block">District:</label>
                      <p className="p-3 bg-gray-50 rounded-lg">
                        {selectedUser.address.district}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="font-medium">Teacher ID:</label>
                    <p className="font-mono">{selectedUser.id}</p>
                  </div>
                  <div>
                    <label className="font-medium">User ID:</label>
                    <p className="font-mono truncate">
                      {selectedUser.user?.toString()}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium">Database ID:</label>
                    <p className="font-mono truncate">
                      {selectedUser._id?.toString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Table;
