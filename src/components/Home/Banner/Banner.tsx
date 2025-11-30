"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaGraduationCap,
  FaShieldAlt,
  FaMedal,
  FaUserTie,
  FaBook,
  FaChartLine,
  FaStar,
  FaAward,
  FaUsers,
  FaGlobe,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      // Your Existing Banner Content
      content: (
        <div className="relative h-full flex items-center justify-center pt-24 pb-40 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            {/* Animated Orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 animate-float">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl rotate-45 flex items-center justify-center shadow-2xl">
              <FaGraduationCap className="text-white text-lg -rotate-45" />
            </div>
          </div>

          <div className="absolute top-40 right-20 animate-float-delayed">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl rotate-12 flex items-center justify-center shadow-2xl">
              <FaMedal className="text-white text-sm -rotate-12" />
            </div>
          </div>

          <div className="absolute bottom-40 left-20 animate-bounce-slow">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl rotate-45 flex items-center justify-center shadow-2xl">
              <FaStar className="text-white text-xs -rotate-45" />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* School Identity */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl rotate-45 shadow-2xl flex items-center justify-center">
                  <FaGraduationCap className="text-white text-3xl -rotate-45" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaStar className="text-white text-xs" />
                </div>
              </div>
            </div>

            {/* Main Headline */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-none"></h1>
              <p className="text-2xl md:text-3xl lg:text-6xl font-extrabold text-gray-300 mb-2">
                Gazipur Shaheen Cadet Academy
              </p>
              <div className="w-full h-1 my-8 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full mb-4"></div>
            </div>

            {/* Smart Tagline */}
            <p className="text-xl md:text-2xl lg:text-3xl mb-12 font-medium text-cyan-300 max-w-4xl mx-auto leading-relaxed">
              Where{" "}
              <span className="text-yellow-400 font-bold">
                Traditional Values
              </span>{" "}
              Meet{" "}
              <span className="text-blue-400 font-bold">Modern Education</span>
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-col md:flex-row gap-8 mb-16 max-w-5xl mx-auto">
              <div className="group">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-12 transition-transform duration-500">
                    <FaUserTie className="text-white text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Cadet Preparation
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Specialized training for cadet college admission with proven
                    success record
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-12 transition-transform duration-500">
                    <FaAward className="text-white text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Proven Excellence
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    25+ years of academic excellence and student success stories
                  </p>
                </div>
              </div>
            </div>

            {/* Stats in Modern Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
              {[
                {
                  icon: FaUsers,
                  number: "5000+",
                  label: "Students",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: FaGraduationCap,
                  number: "98%",
                  label: "Success Rate",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  icon: FaMedal,
                  number: "25+",
                  label: "Years",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  icon: FaChartLine,
                  number: "200+",
                  label: "Cadets",
                  color: "from-orange-500 to-red-500",
                },
              ].map((stat, index) => (
                <div key={index} className="group text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <stat.icon className="text-white text-xl" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Link
                href="/admission"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 border border-cyan-500/30"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <FaGraduationCap className="text-cyan-300" />
                  Start Your Journey
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <Link
                href="/programs"
                className="group relative px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <FaBook className="text-gray-300" />
                  Explore Programs
                </span>
              </Link>
            </div>

            {/* Quick Info Bar */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-2 text-cyan-300">
                  <FaGlobe className="text-cyan-400" />
                  <span>English Medium Education</span>
                </div>
                <div className="flex items-center gap-2 text-green-300">
                  <FaShieldAlt className="text-green-400" />
                  <span>Play to Class 10</span>
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                  <FaMedal className="text-purple-400" />
                  <span>Since 1995</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-gray-400 text-sm font-medium">
                Explore More
              </span>
              <div className="w-6 h-10 border-2 border-cyan-500/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-cyan-500 rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
      ),
    },
    {
      // Directors Introduction Slide
      content: (
        <div className="relative  h-full flex items-center justify-center pt-24 pb-36 bg-gradient-to-br from-slate-800 via-purple-900 to-blue-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>

          <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Section Title */}
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Meet Our Leadership
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Experienced educators and visionaries guiding our institution
                towards excellence
              </p>
            </div>

            {/* Directors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
              {/* Director 1 */}
              <div className="group">
                <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                    JD
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Md. Jubayet Hossen
                  </h3>
                  <p className="text-purple-300 font-semibold mb-4">
                    Founder & Chairman
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Visionary educator with 25+ years of experience in shaping
                    young minds and building future leaders through quality
                    education.
                  </p>
                </div>
              </div>

              {/* Director 2 */}
              <div className="group">
                <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                    SA
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Fahima Akter
                  </h3>
                  <p className="text-blue-300 font-semibold mb-4">
                    Academic Director
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Dedicated to academic excellence and innovative teaching
                    methodologies. Passionate about student success and holistic
                    development.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Our Mission
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                `To provide a nurturing environment that combines academic
                excellence with character building, preparing students not just
                for exams, but for life. We are committed to developing future
                leaders who will make positive contributions to society.`
              </p>
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto slide every 10 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      {/* Slider Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {slide.content}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
      >
        <FaChevronRight />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "bg-cyan-500 w-8"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
