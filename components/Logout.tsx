import React from "react";
import { signOut } from "next-auth/react";
const Logout = () => {
  return (
    <div
      className=" cursor-pointer text-center p-2 hoverAnimation"
      onClick={() => {
        signOut();
      }}
    >
      Logout
    </div>
  );
};

export default Logout;
