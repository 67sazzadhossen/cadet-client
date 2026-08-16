"use client";

import { DashboardField, GlassPanel } from "./GlassUI";

type EditableValue = string | number | boolean | null | EditableValue[] | { [key: string]: EditableValue };

const hiddenFields = new Set(["_id", "__v", "createdAt", "updatedAt", "user", "password", "fcmTokens"]);
const labelFor = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").trim();

const setAtPath = (source: Record<string, any>, path: string[], value: EditableValue) => {
  const copy = structuredClone(source);
  let current: Record<string, any> = copy;
  path.slice(0, -1).forEach((key) => {
    current[key] = current[key] && typeof current[key] === "object" ? current[key] : {};
    current = current[key];
  });
  current[path.at(-1)!] = value;
  return copy;
};

const parseArray = (value: string, current: EditableValue[]) => {
  if (current.some((item) => item && typeof item === "object")) {
    try { return JSON.parse(value); } catch { return current; }
  }
  return value.split(",").map((item) => item.trim()).filter(Boolean);
};

export const DynamicUserFields = ({
  value,
  onChange,
}: {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
}) => {
  const renderValue = (key: string, fieldValue: EditableValue, path: string[]): React.ReactNode => {
    if (hiddenFields.has(key)) return null;
    if (Array.isArray(fieldValue)) {
      const containsObjects = fieldValue.some((item) => item && typeof item === "object");
      return <DashboardField key={path.join(".")} label={`${labelFor(key)}${containsObjects ? " (JSON)" : " (comma separated)"}`}>
        <textarea className="dashboard-input min-h-20" value={containsObjects ? JSON.stringify(fieldValue, null, 2) : fieldValue.join(", ")} onChange={(event) => onChange(setAtPath(value, path, parseArray(event.target.value, fieldValue)))} />
      </DashboardField>;
    }
    if (fieldValue && typeof fieldValue === "object") {
      return <GlassPanel key={path.join(".")} className="col-span-full p-4">
        <h3 className="mb-3 font-semibold capitalize text-blue-50">{labelFor(key)}</h3>
        <div className="grid gap-3 sm:grid-cols-2">{Object.entries(fieldValue).map(([nestedKey, nestedValue]) => renderValue(nestedKey, nestedValue, [...path, nestedKey]))}</div>
      </GlassPanel>;
    }
    if (typeof fieldValue === "boolean") {
      return <DashboardField key={path.join(".")} label={labelFor(key)}><select className="dashboard-input" value={String(fieldValue)} onChange={(event) => onChange(setAtPath(value, path, event.target.value === "true"))}><option value="true">Yes</option><option value="false">No</option></select></DashboardField>;
    }
    const inputType = typeof fieldValue === "number" ? "number" : key.toLowerCase().includes("date") ? "date" : key.toLowerCase().includes("email") ? "email" : "text";
    return <DashboardField key={path.join(".")} label={labelFor(key)}><input className="dashboard-input" type={inputType} value={fieldValue ?? ""} onChange={(event) => onChange(setAtPath(value, path, inputType === "number" ? Number(event.target.value) : event.target.value))} /></DashboardField>;
  };

  return <div className="grid gap-3 sm:grid-cols-2">{Object.entries(value).map(([key, fieldValue]) => renderValue(key, fieldValue, [key]))}</div>;
};
