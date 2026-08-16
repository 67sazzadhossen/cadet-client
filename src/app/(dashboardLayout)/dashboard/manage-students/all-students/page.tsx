import { redirect } from "next/navigation";

const AllStudentsPage = () => redirect("/dashboard/users?role=student");

export default AllStudentsPage;
