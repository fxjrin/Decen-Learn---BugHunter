import React, { useState } from "react";

const Dropdown = ({ trigger, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  let timeoutId;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center space-x-2 cursor-pointer">
        {trigger(isOpen)}
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 min-w-max w-40 bg-white text-black rounded-lg shadow-lg">
          <ul className="py-2">{children}</ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
