import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useAuth } from "./useAuth";

const MainLayout = ({ children, state, setState }) => {
  const { principal, login, logout, loadUser } = useAuth({state, setState});
  const [isUserLoading, setIsUserLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (state.isAuthenticated && principal && !state.user) {
        setIsUserLoading(true);
        await loadUser();
        setIsUserLoading(false);
      }
    };

    fetchUser();
  }, [state.isAuthenticated, state.user, principal]);

  if (state.isLoading || isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <Header
        {...{
          isAuthenticated: state.isAuthenticated,
          login,
          logout,
          username: state.user?.username,
          profilePicture: state.user?.profilePicture,
        }}
      />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
