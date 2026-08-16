"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { DynamicUserFields } from "@/components/dashboard/DynamicUserFields";
import { DashboardButton, GlassPanel } from "@/components/dashboard/GlassUI";
import {
  useCreateAdminUserMutation,
  useDeleteAdminUserMutation,
  useGetAdminUsersQuery,
  useResetAdminUserPasswordMutation,
  useUpdateAdminUserMutation,
} from "@/redux/features/users/adminUserApi";

const emptyAddress = () => ({ address: "", district: "" });
const emptyName = () => ({ englishName: "", bengaliName: "" });
const emptyImage = () => ({ url: "", publicId: "" });

const createTemplate = (role: string) => {
  const common = { id: "", role, name: emptyName(), image: emptyImage(), dateOfBirth: "", bloodGroup: "A+" };
  if (role === "student") return {
    ...common, email: "", admissionDate: "", admissionClass: "Play", currentClass: "Play",
    religion: "", nationality: "Bangladeshi", birthCertificateNo: "", previousSchool: "",
    rollNo: "", version: "bangla", isCadet: false, WhatsappNumber: "", transportation: "no",
    waiver: 0, admissionFee: 0, sessionFee: 0, siblings: [],
    guardian: {
      father: { name: emptyName(), mobile: "", nid: "", occupation: "", presentAddress: emptyAddress(), permanentAddress: emptyAddress() },
      mother: { name: emptyName(), mobile: "", nid: "", occupation: "", presentAddress: emptyAddress(), permanentAddress: emptyAddress() },
      localGuardian: { name: "", email: "", relation: "", phone: "" },
    },
  };
  const staff = { ...common, contact: { email: "", mobile: "", whatsapp: "" }, designation: "", qualification: "", gender: "male", address: emptyAddress() };
  return role === "teacher" ? { ...staff, joiningDate: "", subjects: [] } : staff;
};

type ManagedUser = {
  id: string;
  user?: {
    role?: string;
    email?: string;
    status?: string;
    isDeleted?: boolean;
    needsPasswordChanged?: boolean;
  };
  name?: { englishName?: string; bengaliName?: string };
  currentClass?: string;
  designation?: string;
  gender?: string;
  [key: string]: any;
};

const unwrapUsers = (response: any): ManagedUser[] =>
  [response, response?.data, response?.data?.data, response?.data?.data?.data]
    .find(Array.isArray) || [];

const mergeProfileFields = (defaults: Record<string, any>, saved: Record<string, any>) =>
  Object.keys({ ...defaults, ...saved }).reduce<Record<string, any>>((merged, key) => {
    const defaultValue = defaults[key];
    const savedValue = saved[key];
    const canMerge = defaultValue && savedValue
      && typeof defaultValue === "object" && typeof savedValue === "object"
      && !Array.isArray(defaultValue) && !Array.isArray(savedValue);
    merged[key] = canMerge
      ? mergeProfileFields(defaultValue, savedValue)
      : savedValue === undefined || savedValue === null ? defaultValue : savedValue;
    return merged;
  }, {});

const editableProfile = (managedUser: ManagedUser) => {
  const { user, _id, __v, createdAt, updatedAt, ...profile } = managedUser;
  void _id; void __v; void createdAt; void updatedAt;
  const role = user?.role || String(profile.role || "admin");
  const editable = mergeProfileFields(createTemplate(role), profile);
  if (role === "student") {
    editable.email = user?.email || profile.email || "";
  } else {
    editable.contact.email = user?.email || profile.contact?.email || "";
  }
  return {
    ...editable,
    status: user?.status || "active",
    needsPasswordChanged: Boolean(user?.needsPasswordChanged),
  };
};

const humanize = (key: string) =>
  key.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").trim();

const apiErrorMessage = (error: any, fallback: string) =>
  error?.data?.errorSources?.[0]?.message
  || error?.data?.message
  || error?.error
  || fallback;

const validateRequiredProfileFields = (profile: Record<string, any>) => {
  if (!String(profile.dateOfBirth || "").trim()) return "Date of birth is required";
  return null;
};

const DetailValue = ({ value }: { value: any }) => {
  if (value === null || value === undefined || value === "") return <span className="text-blue-100/40">Not set</span>;
  if (Array.isArray(value)) return <span>{value.map((item) => typeof item === "object" ? JSON.stringify(item) : String(item)).join(", ") || "Not set"}</span>;
  if (typeof value === "boolean") return <span>{value ? "Yes" : "No"}</span>;
  if (typeof value === "object") return <div className="grid gap-2 sm:grid-cols-2">{Object.entries(value).filter(([key]) => !key.startsWith("_")).map(([key, nested]) => <div key={key} className="rounded-lg border border-blue-200/10 bg-blue-950/20 p-2"><p className="text-[10px] font-bold uppercase tracking-wider text-blue-200/55">{humanize(key)}</p><DetailValue value={nested} /></div>)}</div>;
  return <span className="break-words">{String(value)}</span>;
};

const UserDetails = ({ user }: { user: ManagedUser }) => {
  const details = editableProfile(user);
  return <div className="grid gap-3 sm:grid-cols-2">
    {Object.entries(details).map(([key, value]) => <div key={key} className={typeof value === "object" && value !== null ? "sm:col-span-2" : ""}><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200/55">{humanize(key)}</p><div className="rounded-xl border border-blue-200/10 bg-blue-950/25 p-3 text-sm text-white"><DetailValue value={value} /></div></div>)}
  </div>;
};

const UniversalUserManagement = ({ initialRole = "student" }: { initialRole?: string }) => {
  const [showDeleted, setShowDeleted] = useState(false);
  const role = initialRole;
  const [selectedClass, setSelectedClass] = useState("Play");
  const [cadetType, setCadetType] = useState("all");
  const [version, setVersion] = useState("bangla");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ManagedUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [draft, setDraft] = useState<Record<string, any>>({});
  const { data, isLoading, isError, error, refetch } = useGetAdminUsersQuery(showDeleted);
  const [createUser, createState] = useCreateAdminUserMutation();
  const [update, updateState] = useUpdateAdminUserMutation();
  const [deleteUser, deleteState] = useDeleteAdminUserMutation();
  const [resetPassword, resetState] = useResetAdminUserPasswordMutation();
  const users = unwrapUsers(data);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((managedUser) => {
      const account = managedUser.user || {};
      if (showDeleted !== Boolean(account.isDeleted)) return false;
      if (account.role !== role) return false;
      if (term) {
        return [managedUser.id, managedUser.rollNo, account.email, managedUser.email,
          managedUser.WhatsappNumber, managedUser.contact?.phone, managedUser.contact?.mobile,
          managedUser.contact?.whatsapp, managedUser.guardian?.father?.mobile,
          managedUser.guardian?.mother?.mobile, managedUser.guardian?.localGuardian?.phone,
          managedUser.name?.englishName, managedUser.name?.bengaliName]
          .filter(Boolean).some((value) => String(value).toLowerCase().includes(term));
      }
      if (role !== "student") return true;
      return managedUser.currentClass === selectedClass
        && String(managedUser.version || "").toLowerCase() === version
        && (cadetType === "all" || Boolean(managedUser.isCadet) === (cadetType === "cadet"));
    });
  }, [users, role, search, showDeleted, selectedClass, version, cadetType]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const visibleUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);
  const allRoleUsers = users.filter((managedUser) => managedUser.user?.role === role && !managedUser.user?.isDeleted);
  const currentGroupCount = role === "student"
    ? allRoleUsers.filter((managedUser) => managedUser.currentClass === selectedClass).length
    : filteredUsers.length;
  useEffect(() => setPage(1), [role, search, showDeleted, pageSize, selectedClass, version, cadetType]);

  const openDetails = (managedUser: ManagedUser) => {
    setSelected(managedUser);
    setDraft(editableProfile(managedUser));
    setIsEditing(false);
  };

  const save = async () => {
    if (!selected) return;
    const validationError = validateRequiredProfileFields(draft);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    try {
      const result = await update({ targetId: selected.id, ...draft }).unwrap();
      const updated = result?.data?.data || { ...selected, ...draft };
      toast.success("User profile updated successfully");
      setSelected(updated);
      setIsEditing(false);
      await refetch();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not update this user"));
    }
  };

  const openCreate = () => {
    setDraft(createTemplate(role));
    setSelected(null);
    setIsEditing(true);
    setIsCreating(true);
  };

  const createNewUser = async () => {
    const validationError = validateRequiredProfileFields(draft);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    try {
      await createUser({ ...draft, role }).unwrap();
      toast.success(`${role} created successfully`);
      setIsCreating(false);
      setIsEditing(false);
      await refetch();
    } catch (error) {
      toast.error(apiErrorMessage(error, `Could not create ${role}`));
    }
  };

  const resetSelectedPassword = async () => {
    if (!selected) return;
    const result = await resetPassword(selected.id).unwrap();
    toast.success(`Default password: ${result.data.data.defaultPassword}`);
  };

  const deleteSelectedUser = async () => {
    if (!selected || !window.confirm(`Delete ${selected.name?.englishName || selected.id}? The user will be moved to the recycle bin.`)) return;
    try {
      await deleteUser(selected.id).unwrap();
      toast.success(`${selected.user?.role || "User"} moved to the recycle bin`);
      setSelected(null);
      setIsEditing(false);
      await refetch();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not delete this user"));
    }
  };

  return <section className="space-y-3 py-2 sm:py-3">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-2xl font-black capitalize text-white sm:text-3xl">{role}s</h1><p className="text-sm capitalize text-blue-100/60">Dashboard / {role} management</p></div>
      <div className="flex items-center gap-3"><p className="text-xs text-blue-100/60">{currentGroupCount} / {allRoleUsers.length} {role}s</p><DashboardButton onClick={openCreate}>Add {role}</DashboardButton></div>
    </div>

    <GlassPanel className="overflow-hidden">
      <div className="flex flex-wrap items-end gap-2 border-b border-blue-200/15 p-3">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-blue-100/70">Show<select className="dashboard-input h-9 w-20 py-1" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option></select></label>
        </div>
        {role === "student" && <>
          <label className="text-xs text-blue-100/70">Class<select className="dashboard-input mt-1 h-9 w-28 py-1" value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}>{["Play", "Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((className) => <option key={className} value={className}>{className}</option>)}</select></label>
          <label className="text-xs text-blue-100/70">Student type<select className="dashboard-input mt-1 h-9 w-40 py-1" value={cadetType} onChange={(event) => setCadetType(event.target.value)}><option value="all">Cadet & non-cadet</option><option value="cadet">Cadet</option><option value="non-cadet">Non-cadet</option></select></label>
          <label className="text-xs text-blue-100/70">Version<select className="dashboard-input mt-1 h-9 w-28 py-1" value={version} onChange={(event) => setVersion(event.target.value)}><option value="bangla">Bangla</option><option value="english">English</option></select></label>
        </>}
        <label className="min-w-52 flex-1 text-xs text-blue-100/70">Search all {role}s<input className="dashboard-input mt-1 h-9 py-1" placeholder="Name, roll, ID or phone" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        <button className={`dashboard-button h-9 ${showDeleted ? "dashboard-button-danger" : "dashboard-button-muted"}`} onClick={() => setShowDeleted((value) => !value)}>{showDeleted ? "Recycle bin" : "Active"}</button>
      </div>

      {isError && <div className="m-3 rounded-xl border border-red-300/30 bg-red-500/10 p-4 text-red-100"><p className="font-bold">Users could not be loaded.</p><p className="text-xs opacity-75">{String((error as any)?.data?.message || (error as any)?.error || "Check the backend and admin login.")}</p><DashboardButton className="mt-2" tone="muted" onClick={() => refetch()}>Try again</DashboardButton></div>}
      {isLoading ? <div className="p-10 text-center text-blue-100/70">Loading users...</div> : !isError && <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="border-b border-blue-200/15 bg-blue-950/20 text-xs uppercase tracking-wider text-blue-100/65"><tr><th className="px-4 py-3">S No.</th><th className="px-4 py-3">User ID</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Roll / Designation</th><th className="px-4 py-3">Class / Version</th><th className="px-4 py-3">Gender</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{visibleUsers.map((managedUser, index) => { const account = managedUser.user || {}; return <tr key={managedUser.id} tabIndex={0} onClick={() => openDetails(managedUser)} onKeyDown={(event) => event.key === "Enter" && openDetails(managedUser)} className="cursor-pointer border-b border-blue-200/10 text-blue-50 transition hover:bg-white/10 focus:bg-white/10 focus:outline-none"><td className="px-4 py-3 text-blue-100/55">{(page - 1) * pageSize + index + 1}</td><td className="px-4 py-3 font-semibold">{managedUser.id}</td><td className="px-4 py-3">{managedUser.name?.englishName || managedUser.name?.bengaliName || "Unnamed user"}</td><td className="px-4 py-3 capitalize">{account.role || "Unknown"}</td><td className="px-4 py-3">{managedUser.rollNo || managedUser.designation || "—"}</td><td className="px-4 py-3 capitalize">{managedUser.currentClass ? `${managedUser.currentClass} / ${managedUser.version || "—"}` : "—"}</td><td className="px-4 py-3 capitalize">{managedUser.gender || "—"}</td><td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-bold ${account.isDeleted || account.status === "blocked" ? "bg-red-400/15 text-red-100" : "bg-emerald-400/15 text-emerald-100"}`}>{account.isDeleted ? "Deleted" : account.status || "Active"}</span></td></tr>; })}</tbody></table>{!visibleUsers.length && <p className="p-10 text-center text-blue-100/55">No matching users found.</p>}</div>}

      <div className="flex items-center justify-between border-t border-blue-200/15 p-3 text-xs text-blue-100/60"><span>Showing {filteredUsers.length ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredUsers.length)} of {filteredUsers.length}</span><div className="flex gap-2"><DashboardButton tone="muted" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</DashboardButton><span className="grid min-w-9 place-items-center rounded-lg bg-white/10 px-2">{page}/{totalPages}</span><DashboardButton tone="muted" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>Next</DashboardButton></div></div>
    </GlassPanel>

    {isCreating && <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/70 backdrop-blur-md sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && !imageUploading && setIsCreating(false)}><GlassPanel className="flex max-h-[94dvh] w-full max-w-5xl flex-col rounded-b-none p-4 sm:rounded-2xl sm:p-5"><div className="mb-4 flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-cyan-200/70">New {role}</p><h2 className="text-xl font-black capitalize text-white">Add {role}</h2><p className="text-xs text-blue-100/55">Complete the role-specific fields below.</p></div><button disabled={imageUploading} className="text-2xl text-blue-100/70 hover:text-white disabled:opacity-40" onClick={() => setIsCreating(false)} aria-label="Close">×</button></div><div className="overflow-y-auto pr-1"><DynamicUserFields value={draft} onChange={setDraft} onUploadStateChange={setImageUploading} /></div><div className="mt-4 flex justify-end gap-2 border-t border-blue-200/15 pt-4"><DashboardButton tone="muted" disabled={imageUploading} onClick={() => setIsCreating(false)}>Cancel</DashboardButton><DashboardButton disabled={createState.isLoading || imageUploading} onClick={createNewUser}>{imageUploading ? "Uploading image..." : createState.isLoading ? "Creating..." : `Add ${role}`}</DashboardButton></div></GlassPanel></div>}

    {selected && <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/70 backdrop-blur-md sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && !imageUploading && setSelected(null)}><GlassPanel className="flex max-h-[94dvh] w-full max-w-5xl flex-col rounded-b-none p-4 sm:rounded-2xl sm:p-5"><div className="mb-4 flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-cyan-200/70">{selected.user?.role} profile</p><h2 className="text-xl font-black text-white">{selected.name?.englishName || selected.name?.bengaliName || selected.id}</h2><p className="text-xs text-blue-100/55">User ID: {selected.id}</p></div><button disabled={imageUploading} className="text-2xl text-blue-100/70 hover:text-white disabled:opacity-40" onClick={() => setSelected(null)} aria-label="Close">×</button></div><div className="overflow-y-auto pr-1">{isEditing ? <DynamicUserFields value={draft} onChange={setDraft} onUploadStateChange={setImageUploading} /> : <UserDetails user={selected} />}</div><div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-blue-200/15 pt-4">{isEditing ? <><DashboardButton tone="muted" disabled={imageUploading} onClick={() => { setDraft(editableProfile(selected)); setIsEditing(false); }}>Cancel edit</DashboardButton><DashboardButton disabled={updateState.isLoading || imageUploading} onClick={save}>{imageUploading ? "Uploading image..." : updateState.isLoading ? "Saving..." : "Save changes"}</DashboardButton></> : <><DashboardButton tone="danger" disabled={deleteState.isLoading || selected.user?.isDeleted} onClick={deleteSelectedUser}>{deleteState.isLoading ? "Deleting..." : "Delete user"}</DashboardButton><DashboardButton tone="muted" disabled={resetState.isLoading} onClick={resetSelectedPassword}>{resetState.isLoading ? "Resetting..." : "Reset password"}</DashboardButton><DashboardButton onClick={() => setIsEditing(true)}>Update profile</DashboardButton></>}</div></GlassPanel></div>}
  </section>;
};

export default UniversalUserManagement;
