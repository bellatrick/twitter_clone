import React, { SVGProps } from "react";
interface props {
  text: string;
  Icon: any;
  active?: boolean;
}
const SidebarLink = ({ text, Icon, active }: props) => {
  return (
    <div
      className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start text-lg space-x-3 hoverAnimation ${
        active ? "font-bold" : ""
      }`}
    >
      <Icon className="h-7" />
      <span className="hidden xl:inline">{text}</span>
    </div>
  );
};

export default SidebarLink;
