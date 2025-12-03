"use client";

import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import image from "@/assets/picture.jpg";

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import Image from "next/image";

const Banner = () => {
  return (
    <Swiper
      cssMode={true}
      navigation={true}
      pagination={true}
      mousewheel={true}
      keyboard={true}
      modules={[Navigation, Pagination, Mousewheel, Keyboard]}
      className=""
    >
      <SwiperSlide>
        <Image src={image} alt="image" width={1920} height={300} />
      </SwiperSlide>
    </Swiper>
  );
};

export default Banner;
