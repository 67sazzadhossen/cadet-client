import EditTeacherProfile from "@/pages/Admin/AllTeachers/EditTeacherProfile";

const EditTeacherPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <EditTeacherProfile teacherId={id} />;
};

export default EditTeacherPage;
