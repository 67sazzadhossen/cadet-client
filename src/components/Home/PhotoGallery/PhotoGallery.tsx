"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { SwiperRef } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const PhotoGallery = () => {
  // SwiperRef টাইপ ব্যবহার করুন
  const swiperRef = useRef<SwiperRef>(null);

  const schoolPhotos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "স্কুল বিল্ডিং",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "ক্লাসরুম",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1524178234883-043d5c3f3cf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "লাইব্রেরি",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "ল্যাবরেটরি",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1519861531473-920034658307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "খেলার মাঠ",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "সাংস্কৃতিক অনুষ্ঠান",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "বিজ্ঞান মেলা",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1492684223066-e9e4aab4d25e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "বার্ষিক ক্রীড়া",
    },
  ];

  return (
    <div className="my-16 py-8 bg-gradient-to-b from-white to-gray-50">
      {/* হেডিং */}
      <div className="text-center mb-12 px-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent  py-8 bg-gradient-to-br from-gray-900 to-blue-900">
          আমাদের আনন্দমুহূর্ত
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          স্কুলের বিভিন্ন আয়োজন, অনুষ্ঠান ও দৈনন্দিন জীবনের কিছু স্মরণীয়
          মুহূর্তের গ্যালারি
        </p>
      </div>

      {/* Swiper গ্যালারি */}
      <div className="relative px-4 max-w-7xl mx-auto">
        <Swiper
          ref={swiperRef}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          initialSlide={3}
          slidesPerView={2}
          spaceBetween={30}
          coverflowEffect={{
            rotate: 15,
            stretch: 0,
            depth: 150,
            modifier: 1.5,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="coverflow-swiper"
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
              coverflowEffect: {
                rotate: 10,
                depth: 100,
                modifier: 1,
              },
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
              coverflowEffect: {
                rotate: 15,
                depth: 150,
                modifier: 1.5,
              },
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
              coverflowEffect: {
                rotate: 20,
                depth: 200,
                modifier: 2,
              },
            },
          }}
        >
          {schoolPhotos.map((photo) => (
            <SwiperSlide key={photo.id}>
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 rounded-2xl"></div>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay with description */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-16">
                  <p className="text-white text-lg font-bold">{photo.alt}</p>
                </div>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation buttons */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => swiperRef.current?.swiper.slidePrev()}
            className="p-3 rounded-full bg-gradient-to-br from-gray-900 to-blue-900 text-white hover:from-blue-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={() => swiperRef.current?.swiper.slideNext()}
            className="p-3 rounded-full bg-gradient-to-br from-gray-900 to-blue-900 text-white hover:from-blue-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Global CSS Styles */}
      <style jsx global>{`
        .coverflow-swiper {
          width: 100%;
          padding: 60px 0;
          overflow: visible !important;
        }

        .coverflow-swiper .swiper-wrapper {
          align-items: center;
        }

        .coverflow-swiper .swiper-slide {
          width: 400px !important;
          height: 450px !important;
          border-radius: 2rem;
          overflow: hidden;
          transition: all 0.4s ease;
          position: relative;
        }

        /* Active slide styles */
        .coverflow-swiper .swiper-slide-active {
          transform: scale(1.1) !important;
          z-index: 10;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }

        /* Inactive slides */
        .coverflow-swiper .swiper-slide:not(.swiper-slide-active) {
          opacity: 0.6;
          filter: brightness(0.8);
          transform: scale(0.85);
        }

        /* Shadow container */
        .coverflow-swiper .swiper-slide-shadow-left,
        .coverflow-swiper .swiper-slide-shadow-right {
          border-radius: 2rem !important;
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.3),
            transparent
          ) !important;
          opacity: 0.5 !important;
        }

        .coverflow-swiper .swiper-slide-shadow-right {
          background: linear-gradient(
            -90deg,
            rgba(0, 0, 0, 0.3),
            transparent
          ) !important;
        }

        /* Pagination bullets */
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(59, 130, 246, 0.5);
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          opacity: 1;
          background: linear-gradient(135deg, #3b82f6, #0d9488);
          transform: scale(1.3);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .coverflow-swiper .swiper-slide {
            width: 280px !important;
            height: 320px !important;
          }

          .coverflow-swiper .swiper-slide-active {
            transform: scale(1.05) !important;
          }
        }

        @media (max-width: 640px) {
          .coverflow-swiper .swiper-slide {
            width: 250px !important;
            height: 300px !important;
          }

          .coverflow-swiper {
            padding: 40px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoGallery;
