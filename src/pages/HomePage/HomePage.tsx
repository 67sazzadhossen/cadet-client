import AboutUs from "@/components/Home/AboutUs/AboutUs";
import Banner from "@/components/Home/Banner/Banner";
import Notice from "@/components/Home/Notice/Notice";
import PhotoGallery from "@/components/Home/PhotoGallery/PhotoGallery";
import Videos from "@/components/Home/Videos/Videos";
import React from "react";

const HomePage = () => {
  return (
    <div className="">
      <Banner />
      <Notice />
      <AboutUs />
      <PhotoGallery />
      <Videos />
    </div>
  );
};

export default HomePage;
