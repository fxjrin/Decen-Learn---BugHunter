import React from "react";

const games = [
  {
    name: "Bug Hunter",
    description: "Spot the bug in the code and explain the issue to our AI to solve it!",
    path: "/games/bughunter",
  },
  {
    name: "Code Challenge",
    description: "Test your coding skills with exciting programming challenges. (Coming Soon)",
    path: "/games/codechallenge",
  },
];

const GamesPage = ({ isAuthenticated }) => {
  const handleGameSelect = (game) => {
    window.location.href = game.path;
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen pt-16 px-6">
      {!isAuthenticated && (
        <div className="w-full max-w-2xl bg-red-500 text-white text-center py-3 px-4 rounded-lg shadow-md mb-6">
          <p className="text-lg font-semibold">You must be logged in to play games!</p>
        </div>
      )}
      
      <h1 className="text-3xl font-bold text-center mb-6">Select a Game</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {games.map((game) => (
          <div
            key={game.path}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 transition-transform transform hover:scale-105 text-center cursor-pointer"
            onClick={() => handleGameSelect(game)}
          >
            <h2 className="text-2xl font-semibold mb-2">{game.name}</h2>
            <p className="text-gray-600 mb-4">{game.description}</p>
            <button
              className={`w-full py-2 font-semibold rounded-lg ${
                isAuthenticated
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? "Play Game" : "Login Required"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
