"use client";

import Marquee from "react-fast-marquee";

const Notice = () => {
  return (
    <div className="  my-1 text-black py-3 flex items-center  pl-2 overflow-hidden">
      <span className="mr-3">Notice: </span>
      <Marquee autoFill>
        I can be a React component, multiple React components, or just some
        text.
      </Marquee>
    </div>
  );
};

export default Notice;
