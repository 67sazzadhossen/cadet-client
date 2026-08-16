"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { bloodGroups, classOptions, genders } from "@/const/index.const";
import { useCloudinaryUpload } from "@/utils/useCloudinaryUpload";
import { DashboardField, GlassPanel } from "./GlassUI";

type EditableValue = string | number | boolean | null | EditableValue[] | { [key: string]: EditableValue };

const hiddenFields = new Set(["_id", "__v", "createdAt", "updatedAt", "user", "password", "fcmTokens", "role"]);
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
  onUploadStateChange,
}: {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  onUploadStateChange?: (uploading: boolean) => void;
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const { uploadToCloudinary, loading: imageUploading, error: uploadError } = useCloudinaryUpload();

  useEffect(() => {
    onUploadStateChange?.(imageUploading);
  }, [imageUploading, onUploadStateChange]);

  const handleImageUpload = async (file?: File) => {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setValidationError("Select a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setValidationError("Image size must be less than 5MB.");
      return;
    }

    setValidationError(null);
    try {
      const image = await uploadToCloudinary(file);
      onChange(setAtPath(value, ["image"], image));
    } catch {
      // The upload hook exposes the user-facing error below.
    }
  };

  const renderValue = (key: string, fieldValue: EditableValue, path: string[]): React.ReactNode => {
    if (hiddenFields.has(key)) return null;
    if (key === "image" && path.length === 1) {
      const image = fieldValue && typeof fieldValue === "object" && !Array.isArray(fieldValue)
        ? fieldValue as { url?: string; publicId?: string }
        : {};

      return <GlassPanel key="image" className="col-span-full p-4">
        <h3 className="mb-3 font-semibold text-blue-50">Profile image</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {image.url ? <Image src={image.url} alt="Profile preview" width={96} height={96} className="h-24 w-24 rounded-xl border border-blue-200/20 object-cover" /> : <div className="grid h-24 w-24 place-items-center rounded-xl border border-dashed border-blue-200/30 bg-blue-950/30 text-center text-xs text-blue-100/45">No image</div>}
          <div className="flex-1">
            <label className={`dashboard-button dashboard-button-muted inline-flex cursor-pointer ${imageUploading ? "pointer-events-none opacity-60" : ""}`}>
              {imageUploading ? "Uploading image..." : image.url ? "Change image" : "Upload image"}
              <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" disabled={imageUploading} onChange={(event) => { void handleImageUpload(event.target.files?.[0]); event.target.value = ""; }} />
            </label>
            {image.url && <button type="button" className="ml-2 text-xs font-semibold text-red-200 hover:text-red-100" onClick={() => onChange(setAtPath(value, ["image"], { url: "", publicId: "" }))}>Remove</button>}
            <p className="mt-2 text-xs text-blue-100/50">JPEG, PNG, or WebP. Maximum 5MB.</p>
            {(validationError || uploadError) && <p className="mt-1 text-xs font-semibold text-red-200">{validationError || uploadError}</p>}
          </div>
        </div>
      </GlassPanel>;
    }
    if (["admissionClass", "currentClass"].includes(key)) {
      return <DashboardField key={path.join(".")} label={labelFor(key)}>
        <select className="dashboard-input" value={String(fieldValue ?? "")} onChange={(event) => onChange(setAtPath(value, path, event.target.value))}>
          {classOptions.map((className) => <option key={className} value={className}>{className}</option>)}
        </select>
      </DashboardField>;
    }
    if (key === "version") {
      return <DashboardField key={path.join(".")} label="Version">
        <select className="dashboard-input" value={String(fieldValue ?? "bangla")} onChange={(event) => onChange(setAtPath(value, path, event.target.value))}>
          <option value="bangla">Bangla</option>
          <option value="english">English</option>
        </select>
      </DashboardField>;
    }
    if (key === "isCadet") {
      return <DashboardField key={path.join(".")} label="Student type">
        <select className="dashboard-input" value={String(Boolean(fieldValue))} onChange={(event) => onChange(setAtPath(value, path, event.target.value === "true"))}>
          <option value="false">Non-cadet</option>
          <option value="true">Cadet</option>
        </select>
      </DashboardField>;
    }
    if (key === "bloodGroup") {
      return <DashboardField key={path.join(".")} label="Blood group">
        <select className="dashboard-input" value={String(fieldValue ?? "A+")} onChange={(event) => onChange(setAtPath(value, path, event.target.value))}>
          {bloodGroups.map((group) => <option key={group} value={group}>{group}</option>)}
        </select>
      </DashboardField>;
    }
    if (key === "gender") {
      return <DashboardField key={path.join(".")} label="Gender">
        <select className="dashboard-input" value={String(fieldValue ?? "male")} onChange={(event) => onChange(setAtPath(value, path, event.target.value))}>
          {genders.map((gender) => <option key={gender} value={gender}>{labelFor(gender)}</option>)}
        </select>
      </DashboardField>;
    }
    if (key === "transportation") {
      return <DashboardField key={path.join(".")} label="Transportation">
        <select className="dashboard-input" value={String(fieldValue ?? "no")} onChange={(event) => onChange(setAtPath(value, path, event.target.value))}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </DashboardField>;
    }
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
    return <DashboardField key={path.join(".")} label={key === "dateOfBirth" ? "Date of birth *" : labelFor(key)}><input className="dashboard-input" type={inputType} required={key === "dateOfBirth"} value={fieldValue ?? ""} onChange={(event) => onChange(setAtPath(value, path, inputType === "number" ? Number(event.target.value) : event.target.value))} /></DashboardField>;
  };

  return <div className="grid gap-3 sm:grid-cols-2">{Object.entries(value).map(([key, fieldValue]) => renderValue(key, fieldValue, [key]))}</div>;
};
