import React, { useEffect, useState } from "react";

const LeaderboardPage = ({ actor }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const users = await actor.getAllUsers();
        const sortedUsers = users
          .map(([, data]) => ({
            username: data.username,
            xp: Number(data.xp),
            profilePicture: data.profilePicture,
            }))
          .sort((a, b) => b.xp - a.xp);
        setLeaderboard(sortedUsers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [actor]);

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-3xl font-bold text-center mb-6">🏆 Leaderboard</h1>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-300">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 rounded-t-lg">
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-right">XP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => {
                const hasProfilePicture =
                  Array.isArray(user.profilePicture) &&
                  user.profilePicture.length > 0;
                const profileImage = hasProfilePicture
                  ? user.profilePicture[0]
                  : null;
                return (
                  <tr
                    key={user.username}
                    className={`${
                      index === 0
                        ? "bg-yellow-300 font-bold"
                        : index === 1
                        ? "bg-gray-300"
                        : index === 2
                        ? "bg-orange-300"
                        : "bg-white"
                    } ${index === leaderboard.length - 1 ? "rounded-b-lg" : ""}`}
                  >
                    <td className="p-3">{index + 1}.</td>
                    <td className="p-3 flex items-center space-x-2">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-8 h-8 rounded-full border border-gray-300 object-cover bg-white"
                        />
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-blue-300 text-white font-medium text-sm">
                          {getInitials(user.username)}
                        </div>
                      )}
                      <span>{user.username}</span>
                    </td>
                    <td className="p-3 text-right">{user.xp} XP</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
