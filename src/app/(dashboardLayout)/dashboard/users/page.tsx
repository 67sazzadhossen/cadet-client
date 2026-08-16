import UniversalUserManagement from "@/pages/Admin/Users/UniversalUserManagement";
import { redirect } from "next/navigation";

const UsersPage = async ({ searchParams }: { searchParams: Promise<{ role?: string }> }) => {
  const { role } = await searchParams;
  if (!["student", "teacher", "admin", "accountant"].includes(role || "")) {
    redirect("/dashboard/users?role=student");
  }
  return <UniversalUserManagement key={role} initialRole={role} />;
};

export default UsersPage;
