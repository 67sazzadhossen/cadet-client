import TeacherProfile from "@/pages/Teacher/TeacherProfile";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  console.log(id);
  return (
    <div>
      <TeacherProfile teacherId={id} />
    </div>
  );
};

export default page;
