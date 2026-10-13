import { redirect } from "next/navigation";

const AllTeachersPage = () => redirect("/dashboard/users?role=teacher");

export default AllTeachersPage;
