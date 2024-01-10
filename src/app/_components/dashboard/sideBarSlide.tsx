import React from "react";

interface ISideBarSlide {
  children: React.ReactNode;
}

export default function SideBarSlide({ children }: ISideBarSlide) {
  return <div className="w-80 py-10 text-center bg-slate-700 ">{children}</div>;
}
