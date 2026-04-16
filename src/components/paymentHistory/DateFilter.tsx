"use client";

import React, { useState } from "react";

// Type definitions
interface Filters {
  fromDate: string;
  toDate: string;
  exactDate: string;
}

interface DateFilterProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

type FilterType = "range" | "exact";

const DateFilter: React.FC<DateFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [filterType, setFilterType] = useState<FilterType>("range");

  const handleFilterTypeChange = (type: FilterType): void => {
    setFilterType(type);
    onFilterChange({
      fromDate: "",
      toDate: "",
      exactDate: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  const hasActiveFilters = Boolean(
    filters.fromDate || filters.toDate || filters.exactDate,
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Filter Payments</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
        >
          Clear All Filters
        </button>
      </div>

      <div className="flex gap-4 mb-4 border-b border-gray-200">
        <button
          onClick={() => handleFilterTypeChange("range")}
          className={`pb-2 px-4 font-medium transition-colors duration-200 ${
            filterType === "range"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Date Range
        </button>
        <button
          onClick={() => handleFilterTypeChange("exact")}
          className={`pb-2 px-4 font-medium transition-colors duration-200 ${
            filterType === "exact"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Exact Date
        </button>
      </div>

      {filterType === "range" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="fromDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              From Date
            </label>
            <input
              id="fromDate"
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="toDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              To Date
            </label>
            <input
              id="toDate"
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      ) : (
        <div>
          <label
            htmlFor="exactDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Date
          </label>
          <input
            id="exactDate"
            type="date"
            name="exactDate"
            value={filters.exactDate}
            onChange={handleInputChange}
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
