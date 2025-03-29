import React from "react";

const Button = ({ onClick, children, variant = "default" }) => {
  const base =
    "px-4 py-2 rounded-[12px] font-medium text-center border-2 ease-in-out active:border-b-2 active:translate-y-[2px] active:mb-[2px] focus:outline-none";

  const variants = {
    hover:
      "text-white bg-button_bg border-border border-b-4 hover:contrast-[0.9]",
    select:
      "text-white bg-button_bg border-border border-b-4 hover:contrast-[0.9] active:text-blue-300 active:border-blue-400 focus:text-blue-300 focus:border-blue-400 focus:contrast-[0.9]",
    blue: "text-white bg-blue-500 border-blue-600 border-b-4 hover:contrast-[1.1]",
    gray: "text-white bg-gray-500 border-gray-600 border-b-4 hover:contrast-[1.1]",
    green:
      "text-white bg-green-500 border-green-600 border-b-4 hover:contrast-[1.1]",
    default:
      "text-[#586670] bg-border border-border border-b-2 translate-y-[2px] mb-[2px]",
  };

  return (
    <button
      onClick={variant === "default" ? undefined : onClick}
      disabled={variant === "default"}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
