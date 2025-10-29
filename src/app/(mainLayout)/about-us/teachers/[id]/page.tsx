const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  console.log(id);
  return <div>Teacher</div>;
};

export default page;
