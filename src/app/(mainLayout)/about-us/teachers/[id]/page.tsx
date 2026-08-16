import PublicProfilePage from "@/pages/PublicPages/PublicProfilePage";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div>
      <PublicProfilePage id={id} />
    </div>
  );
};

export default page;
