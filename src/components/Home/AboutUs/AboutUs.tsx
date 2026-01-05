import React from "react";
import {
  BookOpen,
  Award,
  Target,
  Heart,
  Globe,
  Calendar,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";

const AboutUs = () => {
  const schoolValues = [
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: "গুণগত শিক্ষা",
      description: "আধুনিক পাঠ্যক্রম ও প্রযুক্তিভিত্তিক শিক্ষাদান পদ্ধতি",
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: "স্নেহ-মমতার পরিবেশ",
      description: "শিক্ষার্থীদের জন্য নিরাপদ ও আন্তরিক শিক্ষাঙ্গন",
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: "মূল্যবোধ শিক্ষা",
      description: "নৈতিকতা ও দেশপ্রেমে উদ্বুদ্ধ নাগরিক গঠন",
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: "বিশ্বায়নের প্রস্তুতি",
      description: "আন্তর্জাতিক মানের শিক্ষায় গড়ে তোলা",
    },
  ];

  const milestones = [
    {
      year: "১৯৯৫",
      title: "প্রতিষ্ঠা",
      description: "৫০ জন শিক্ষার্থী নিয়ে যাত্রা শুরু",
    },
    {
      year: "২০০৫",
      title: "আধুনিকায়ন",
      description: "ডিজিটাল ল্যাব ও কম্পিউটার শিক্ষা চালু",
    },
    {
      year: "২০১৫",
      title: "স্বীকৃতি",
      description: "জাতীয় পর্যায়ে শ্রেষ্ঠ বিদ্যালয় পুরস্কার",
    },
    {
      year: "২০২৩",
      title: "সম্প্রসারণ",
      description: "নতুন একাডেমিক ভবন ও খেলার মাঠ",
    },
  ];

  const teachingStaff = [
    {
      name: "ড. সায়রা ইসলাম",
      position: "প্রধান শিক্ষিকা",
      experience: "২৫ বছর",
      subject: "উচ্চতর গণিত",
    },
    {
      name: "আহমেদ রিয়াজ",
      position: "সহকারী প্রধান শিক্ষক",
      experience: "২০ বছর",
      subject: "বিজ্ঞান",
    },
    {
      name: "ফারহানা আহমেদ",
      position: "শিক্ষিকা",
      experience: "১৫ বছর",
      subject: "বাংলা ও সাহিত্য",
    },
    {
      name: "মোঃ সাজিদ হাসান",
      position: "শিক্ষক",
      experience: "১২ বছর",
      subject: "ইংরেজি",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            আমাদের সম্পর্কে
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
            প্রজন্মের পর প্রজন্মকে আলোকিত করে আসছি ১৯৯৫ সাল থেকে। শিক্ষা,
            নৈতিকতা ও সৃজনশীলতার সমন্বয়ে গড়ে তুলছি আগামী দিনের নাগরিক।
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-3xl shadow-xl p-6 md:p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/3 w-full">
                <div className="relative">
                  <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-8 border-white shadow-lg mx-auto">
                    <Image
                      src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                      alt="Principal"
                      className="w-full h-full object-cover"
                      width={400}
                      height={400}
                      priority
                    />
                  </div>
                  <div className="text-center mt-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                      ড. সায়রা ইসলাম
                    </h3>
                    <p className="text-lg text-blue-600 font-semibold">
                      প্রধান শিক্ষিকা
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      এম.এসসি (গণিত), পিএইচ.ডি, ২৫+ বছর অভিজ্ঞতা
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:w-2/3 w-full">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    প্রধান শিক্ষিকার বাণী
                  </h2>
                </div>
                <div className="space-y-4 text-gray-700 text-base md:text-lg leading-relaxed">
                  <p>প্রিয় শিক্ষার্থী, অভিভাবক ও শিক্ষকমণ্ডলী,</p>
                  <p>
                    শিক্ষা শুধুমাত্র পাঠ্যপুস্তকের মধ্যে সীমাবদ্ধ নয়, এটি হলো
                    জীবন গড়ার মহৎ শিল্প। আমাদের বিদ্যালয় প্রতিটি শিক্ষার্থীর
                    মধ্যে সুপ্ত প্রতিভা বিকাশের লক্ষ্যে কাজ করে চলেছে।
                  </p>
                  <p>
                    আমরা বিশ্বাস করি, শিক্ষার প্রকৃত উদ্দেশ্য হলো একজন শিশুকে
                    সৎ, দক্ষ, দায়িত্বশীল ও মানবিক নাগরিক হিসেবে গড়ে তোলা।
                    এখানে শিক্ষার্থীরা শেখার সাথে সাথে খেলাধুলা, সাংস্কৃতিক
                    চর্চা ও সামাজিক কর্মকাণ্ডের মাধ্যমে নিজেদেরকে সমৃদ্ধ করে।
                  </p>
                  <p className="font-semibold text-blue-700 italic">
                    &quot;জ্ঞানই শক্তি, আর সদাচরণই জীবনের সবচেয়ে বড়
                    সম্পদ।&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              আমাদের মূল্যবোধ
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              যে নীতিমালা আমাদেরকে অনন্য করে তোলে
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {schoolValues.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-blue-600 mb-6 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-center text-sm md:text-base">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              আমাদের যাত্রাপথ
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              একটি সমৃদ্ধ ইতিহাসের মাইলফলক
            </p>
          </div>
          <div className="relative">
            {/* Timeline line for desktop */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 hidden md:block"></div>

            <div className="space-y-8 md:space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`md:w-5/12 ${
                      index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                    } w-full mb-4 md:mb-0`}
                  >
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                      <div className="text-blue-600 text-2xl md:text-3xl font-bold mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10 my-4 md:my-0"></div>

                  {/* Empty space for alignment on desktop */}
                  <div className="md:w-5/12 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Staff */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              আমাদের অভিজ্ঞ শিক্ষকমণ্ডলী
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              যাদের হাত ধরে গড়ে উঠছে আগামীর ভিত্তি
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {teachingStaff.map((teacher, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 md:h-56 overflow-hidden">
                  <Image
                    width={600}
                    height={600}
                    src={`https://images.unsplash.com/photo-15${index}674011-5b6c-12c0-7ed0-8d7cf18c0b1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`}
                    alt={teacher.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
                    {teacher.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-2 text-sm md:text-base">
                    {teacher.position}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm md:text-base">
                    <Calendar className="h-4 w-4" />
                    <span>{teacher.experience} অভিজ্ঞতা</span>
                  </div>
                  <p className="text-gray-700 text-sm md:text-base">
                    <span className="font-semibold">বিষয়:</span>{" "}
                    {teacher.subject}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">২৮+</div>
              <div className="text-lg md:text-xl">সফল বছর</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">২০০০+</div>
              <div className="text-lg md:text-xl">বর্তমান শিক্ষার্থী</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">১২৫+</div>
              <div className="text-lg md:text-xl">প্রশিক্ষিত শিক্ষক</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">৯৮%</div>
              <div className="text-lg md:text-xl">পাশের হার</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 md:p-8 rounded-3xl shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  আমাদের লক্ষ্য
                </h2>
              </div>
              <ul className="space-y-4 text-gray-700 text-base md:text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>
                    প্রতিটি শিক্ষার্থীর মধ্যে সুপ্ত প্রতিভার বিকাশ ঘটানো
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>জাতীয় শিক্ষানীতি অনুসরণ করে আধুনিক শিক্ষাদান</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>ডিজিটাল বাংলাদেশ গঠনে অবদান রাখা</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>নৈতিকতা ও মূল্যবোধ সম্পন্ন নাগরিক তৈরি করা</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-white p-6 md:p-8 rounded-3xl shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 md:h-8 md:w-8 text-teal-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  আমাদের অঙ্গীকার
                </h2>
              </div>
              <ul className="space-y-4 text-gray-700 text-base md:text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>
                    শিক্ষার্থীদের জন্য নিরাপদ ও আনন্দময় পরিবেশ নিশ্চিত করা
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>
                    মা-বাবাকে নিয়মিত শিক্ষার্থীর অগ্রগতি সম্পর্কে অবহিত করা
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>শিক্ষকদের নিয়মিত প্রশিক্ষণের মাধ্যমে আধুনিকায়ন</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>
                    সাশ্রয়ী মূল্যে সর্বোচ্চ মানের শিক্ষা পরিবেশ উপহার দেওয়া
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
            আপনার সন্তানের ভবিষ্যৎ আমাদের সাথে গড়ে তুলুন
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            আমাদের শিক্ষা পরিবারে যুক্ত হয়ে দেখুন আপনার সন্তানের সক্ষমতা কত
            দ্রুত বিকশিত হয়
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 md:px-8 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg">
              ভর্তি প্রক্রিয়া জানুন
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 md:px-8 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-white hover:text-blue-600 transition-colors duration-300">
              ক্যাম্পাস ট্যুর বুক করুন
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;