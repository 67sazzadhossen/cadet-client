"use client";

import {
  useCreateStudentMutation,
  useGetStudentQuery,
} from "@/redux/features/student/studentApi";
import { useForm, SubmitHandler } from "react-hook-form";

type StudentFormData = {
  admissionDate: string;
  id: string;
  image: string;
  email: string;
  admissionClass: string;
  name: {
    bengaliName: string;
    englishName: string;
  };
  dateOfBirth: string;
  religion: string;
  nationality: string;
  birthCertificateNo: string;
  previousSchool: string;
  rollNo: string;
  version: string;
  guardian: {
    father: {
      name: { bengaliName: string; englishName: string };
      mobile: string;
      nid: string;
      occupation: string;
      presentAddress: { address: string; district: string };
      permanentAddress: { address: string; district: string };
    };
    mother: {
      name: { englishName: string };
      mobile: string;
      nid: string;
      occupation: string;
      presentAddress: { address: string; district: string };
      permanentAddress: { address: string; district: string };
    };
    localGuardian: {
      name: string;
      email: string;
      relation: string;
      phone: string;
    };
  };
  WhatsappNumber: string;
  transportation: string;
};

const Page = () => {
  const { data, isLoading } = useGetStudentQuery(undefined);
  const [createStudent, { isLoading: createLoading, isError }] =
    useCreateStudentMutation();
  // console.log(data);

  const { register, handleSubmit, reset } = useForm<StudentFormData>({
    defaultValues: {
      admissionDate: "2025-01-01",
      id: "STU-1001",
      image: "https://i.pravatar.cc/150?img=5",
      email: "student1001@example.com",
      admissionClass: "Class 5",
      name: {
        bengaliName: "মাহিন ইসলাম",
        englishName: "Mahin Islam",
      },
      dateOfBirth: "2015-03-20",
      religion: "Islam",
      nationality: "Bangladeshi",
      birthCertificateNo: "1234567890",
      previousSchool: "Sunshine Kinder School",
      rollNo: "12",
      version: "english",

      guardian: {
        father: {
          name: {
            bengaliName: "মোঃ রফিকুল ইসলাম",
            englishName: "Md Rafiqul Islam",
          },
          mobile: "01710000000",
          nid: "1999123456",
          occupation: "Businessman",
          presentAddress: {
            address: "Mirpur-10, Dhaka",
            district: "Dhaka",
          },
          permanentAddress: {
            address: "Fulbaria, Mymensingh",
            district: "Mymensingh",
          },
        },

        mother: {
          name: {
            englishName: "Sharmin Akter",
          },
          mobile: "01820000000",
          nid: "2000123456",
          occupation: "Housewife",
          presentAddress: {
            address: "Mirpur-10, Dhaka",
            district: "Dhaka",
          },
          permanentAddress: {
            address: "Fulbaria, Mymensingh",
            district: "Mymensingh",
          },
        },

        localGuardian: {
          name: "Abdul Karim",
          email: "karim@example.com",
          relation: "Uncle",
          phone: "01930000000",
        },
      },

      WhatsappNumber: "01750000000",
      transportation: "yes",
    },
  });

  const onSubmit: SubmitHandler<StudentFormData> = async (formData) => {
    // console.log("New student:", formData);
    // 👉 এখানে তোমার POST API call যাবে
    // await addStudent(formData)
    const res = await createStudent(formData).unwrap();
    console.log("Inside Function", res);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Create Student</h1>

      {/* Student List */}
      <div className="mb-6">
        <h2 className="font-semibold">Existing Students:</h2>
        {data?.data?.data?.map((student: any) => (
          <div key={student._id}>{student.name.englishName}</div>
        ))}
      </div>

      {/* Create Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 bg-gray-100 p-6 rounded-lg"
      >
        {/* Basic Info */}
        <input {...register("id")} placeholder="Student ID" className="input" />
        <input
          {...register("admissionClass")}
          placeholder="Admission Class"
          className="input"
        />
        <input {...register("admissionDate")} type="date" className="input" />
        <input {...register("email")} placeholder="Email" className="input" />
        <input
          {...register("image")}
          placeholder="Image URL"
          className="input"
        />
        <input {...register("dateOfBirth")} type="date" className="input" />
        <input
          {...register("religion")}
          placeholder="Religion"
          className="input"
        />
        <input
          {...register("nationality")}
          placeholder="Nationality"
          className="input"
        />
        <input
          {...register("birthCertificateNo")}
          placeholder="Birth Certificate No"
          className="input"
        />
        <input
          {...register("previousSchool")}
          placeholder="Previous School"
          className="input"
        />
        <input
          {...register("rollNo")}
          placeholder="Roll No"
          className="input"
        />
        <input
          {...register("version")}
          placeholder="Version"
          className="input"
        />

        {/* Name */}
        <input
          {...register("name.englishName")}
          placeholder="English Name"
          className="input"
        />
        <input
          {...register("name.bengaliName")}
          placeholder="Bengali Name"
          className="input"
        />

        {/* Guardian Info */}
        <h3 className="col-span-2 font-semibold mt-4">Father Info</h3>
        <input
          {...register("guardian.father.name.englishName")}
          placeholder="Father English Name"
          className="input"
        />
        <input
          {...register("guardian.father.name.bengaliName")}
          placeholder="Father Bengali Name"
          className="input"
        />
        <input
          {...register("guardian.father.mobile")}
          placeholder="Father Mobile"
          className="input"
        />
        <input
          {...register("guardian.father.nid")}
          placeholder="Father NID"
          className="input"
        />
        <input
          {...register("guardian.father.occupation")}
          placeholder="Father Occupation"
          className="input"
        />

        <input
          {...register("guardian.father.presentAddress.address")}
          placeholder="Father Present Address"
          className="input"
        />
        <input
          {...register("guardian.father.presentAddress.district")}
          placeholder="Father Present District"
          className="input"
        />
        <input
          {...register("guardian.father.permanentAddress.address")}
          placeholder="Father Permanent Address"
          className="input"
        />
        <input
          {...register("guardian.father.permanentAddress.district")}
          placeholder="Father Permanent District"
          className="input"
        />

        <h3 className="col-span-2 font-semibold mt-4">Mother Info</h3>
        <input
          {...register("guardian.mother.name.englishName")}
          placeholder="Mother English Name"
          className="input"
        />
        <input
          {...register("guardian.mother.mobile")}
          placeholder="Mother Mobile"
          className="input"
        />
        <input
          {...register("guardian.mother.nid")}
          placeholder="Mother NID"
          className="input"
        />
        <input
          {...register("guardian.mother.occupation")}
          placeholder="Mother Occupation"
          className="input"
        />

        <input
          {...register("guardian.mother.presentAddress.address")}
          placeholder="Mother Present Address"
          className="input"
        />
        <input
          {...register("guardian.mother.presentAddress.district")}
          placeholder="Mother Present District"
          className="input"
        />
        <input
          {...register("guardian.mother.permanentAddress.address")}
          placeholder="Mother Permanent Address"
          className="input"
        />
        <input
          {...register("guardian.mother.permanentAddress.district")}
          placeholder="Mother Permanent District"
          className="input"
        />

        <h3 className="col-span-2 font-semibold mt-4">Local Guardian</h3>
        <input
          {...register("guardian.localGuardian.name")}
          placeholder="Local Guardian Name"
          className="input"
        />
        <input
          {...register("guardian.localGuardian.email")}
          placeholder="Local Guardian Email"
          className="input"
        />
        <input
          {...register("guardian.localGuardian.relation")}
          placeholder="Relation"
          className="input"
        />
        <input
          {...register("guardian.localGuardian.phone")}
          placeholder="Phone"
          className="input"
        />

        {/* Contact */}
        <input
          {...register("WhatsappNumber")}
          placeholder="WhatsApp Number"
          className="input"
        />
        <input
          {...register("transportation")}
          placeholder="Transportation (yes/no)"
          className="input"
        />

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Create Student
        </button>
      </form>
    </div>
  );
};

export default Page;
