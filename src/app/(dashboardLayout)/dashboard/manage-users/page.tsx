import { redirect } from "next/navigation";

const AllUsersPage = () => redirect("/dashboard/users?role=student");

export default AllUsersPage;
