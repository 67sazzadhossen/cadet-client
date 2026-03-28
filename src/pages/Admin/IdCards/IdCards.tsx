"use client";
import IdCard from "@/components/IdCard/IdCard";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { useGetAllStudentsQuery } from "@/redux/features/student/studentApi";

const IdCards = () => {
  const query = {
    search: "",
    class: "",
    version: "",
    page: 1,
    limit: 1000,
  };

  const { data, isLoading, refetch } = useGetAllStudentsQuery(query);
  console.log(data?.data);
  console.log("hi");
  if (isLoading) {
    return <LoadingAnimation />;
  }
  return (
    <div>
      <IdCard />{" "}
    </div>
  );
};

export default IdCards;
