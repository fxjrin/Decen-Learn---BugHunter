import React, { useState, useEffect } from "react";
import Button from "./Button";
import Dropdown from "./Dropdown";

const Header = ({ isAuthenticated, login, logout, username, profilePicture }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const currentPath = window.location.pathname;
  const getNavClass = (path) =>
  currentPath === path
    ? "text-blue-300 font-semibold pointer-events-none"
    : "text-light font-semibold hover:text-gray-300 cursor-pointer";

  const menuItemClass = "px-4 py-2 hover:bg-gray-200 cursor-pointer";

  
  const MenuItem = ({ text, link, onClick }) => (
    <li
      className={menuItemClass}
      onClick={onClick ? onClick : () => (window.location.href = link)}
    >
      {text}
    </li>
  );

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const hasProfilePicture = Array.isArray(profilePicture) && profilePicture.length > 0;
  const profileImage = hasProfilePicture ? profilePicture[0] : null;
  
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-light/20 py-5 flex justify-between items-center px-16">
      <h1 className="text-light font-bold text-3xl">Decen Learn</h1>

      <nav>
        <ul className="flex space-x-12">
          <li className={getNavClass("/")} onClick={() => window.location.href = "/"}>Home</li>
          <li className={getNavClass("/courses")} onClick={() => window.location.href = "/courses"}>Courses</li>
          <li className={getNavClass("/games")} onClick={() => window.location.href = "/games"}>Games</li>
          <li className={getNavClass("/leaderboard")} onClick={() => window.location.href = "/leaderboard"}>Leaderboard</li>
          <li className={getNavClass("/community")} onClick={() => window.location.href = "/community"}>Community</li>
        </ul>
      </nav>

      {isAuthenticated ? (
        <Dropdown
          trigger={(isOpen) => (
            <div className="flex items-center space-x-2 cursor-pointer">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover bg-white"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white bg-blue-300 text-white font-medium text-lg">
                  {getInitials(username)}
                </div>
              )}
              <span className="text-light font-semibold">
                {username
                  ? `@${
                      username.length > 10
                        ? username.substring(0, 10) + "..."
                        : username
                    }`
                  : ""}
              </span>
              <span
                className={`transition-transform transform ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill="white"
                  stroke="white"
                  stroke-width="15"
                  width="16"
                  height="16"
                >
                  <path d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z"></path>
                </svg>
              </span>
            </div>
          )}
        >
          <MenuItem text="Home" link="/" />
          <MenuItem text="Profile" link="/profile" />
          <MenuItem text="Settings" link="/settings" />
          <MenuItem text={theme === "light" ? "Dark Mode" : "Light Mode"} onClick={toggleTheme} />
          <MenuItem text="Logout" onClick={logout} />
        </Dropdown>
      ) : (
        <Button onClick={login} variant="blue">
          Login
        </Button>
      )}
    </header>
  );
};

export default Header;
