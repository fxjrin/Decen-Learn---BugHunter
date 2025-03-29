import React, { useState, useEffect } from "react";
import Button from "./Button";
import MainLayout from "./MainLayout";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import GamesPage from "./GamesPage";
import BugHunter from "./BugHunter";
import LeaderboardPage from "./LeaderboardPage";
import CoursesPage from "./CoursesPage";

const App = () => {
  const [state, setState] = useState({
    isAuthenticated: false,
    actor: null,
    user: null,
    isLoading: true,
    oldUsername: null,
  });
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (state.actor) {
      state.actor.initChallenges();
    }
  }, [state.actor]);

  window.navigate = (newPath) => {
    window.history.pushState({}, "", newPath);
    setPath(newPath);
  };

  useEffect(() => {
    if (
      state.oldUsername &&
      state.user?.username &&
      state.oldUsername !== state.user.username
    ) {
      window.navigate(`/profile/${state.user.username}`);
    }
  }, [state.oldUsername, state.user?.username]);

  useEffect(() => {
    if (path === "/profile" && state.user?.username) {
      window.navigate(`/profile/${state.user.username}`);
    }

    if (path.startsWith("/profile") && state.user?.username) {
      const currentUsername = path.split("/")[2];

      if (
        currentUsername === state.oldUsername &&
        currentUsername !== state.user.username
      ) {
        window.navigate(`/profile/${state.user.username}`);
      }
    }
  }, [path, state.user?.username, state.oldUsername]);

  const renderPage = () => {
    if (path === "/") return <HomePage />;
    if (path === "/profile") return <ProfilePage />;
    if (path.startsWith("/profile/")) {
      const username = path.split("/")[2];
      return (
        <ProfilePage
          usernameUrl={username}
          user={state.user}
          actor={state.actor}
          setState={setState}
        />
      );
    }
    if (path === "/courses") return <CoursesPage />;
    if (path === "/games") return <GamesPage isAuthenticated={state.isAuthenticated} />;
    if (path === "/games/bughunter")
      return <BugHunter actor={state.actor} user={state.user} />;
    if (path === "/leaderboard") return <LeaderboardPage actor={state.actor} />;
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mt-2">Oops! Page not found.</p>
        <br/>
        <Button
          variant="blue"
          onClick={() => window.navigate("/")}
        >
          Go Back Home
        </Button>
      </div>
    );
  };

  return (
    <MainLayout state={state} setState={setState}>
      {renderPage()}
    </MainLayout>
  );
};

export default App;
