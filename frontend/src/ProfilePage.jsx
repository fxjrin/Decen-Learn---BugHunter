import React, { useState, useEffect } from "react";

const ProfilePage = ({ usernameUrl, user, actor, setState }) => {
  const [username, setUsername] = useState(user?.username || "");
  const [name, setName] = useState(user?.name?.[0] || "");
  const [bio, setBio] = useState(user?.bio?.[0] || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture?.[0] || "");
  const [previewImage, setPreviewImage] = useState(user?.profilePicture?.[0] || "");
  const [xp, setXp] = useState(Number(user?.xp) || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setName(user.name?.[0] || "");
      setBio(user.bio?.[0] || "");
      setProfilePicture(user.profilePicture?.[0] || "");
      setPreviewImage(user.profilePicture?.[0] || "");
      setXp(Number(user?.xp) || 0);
    }
  }, [user]);

  const rank = xp > 1000 ? "Master" : xp > 500 ? "Expert" : xp > 100 ? "Intermediate" : "Beginner";

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Maximum image size is 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
      setProfilePicture(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async () => {
    if (!user) {
      console.error("User data not found!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedData = {
        username: username ? [username] : [],
        name: name ? [name] : [],
        bio: bio ? [bio] : [],
        profilePicture: profilePicture ? [profilePicture] : user?.profilePicture,
      };
      const result = await actor.updateUserProfile(updatedData);

      if (result.ok) {
        setState((prev) => ({
          ...prev,
          oldUsername: prev.user?.username,
          user: {
            ...prev.user,
            username,
            name: [name],
            bio: [bio],
            profilePicture: [profilePicture],
          },
        }));
      } else {
        console.error("Failed to update profile:", result.err);
        setError(result.err || "Profile update failed.");
      }
    } catch (error) {
      console.error("An error occurred while updating:", error);
      setError("Profile update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isOwnProfile = usernameUrl === user?.username;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-10 border border-gray-200">
      {isOwnProfile ? (
        <>
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">{username}'s Profile</h2>
          <div className="flex flex-col items-center mb-4">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-2xl font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <p className="text-gray-700 mt-2 font-medium">XP: {xp} - <span className="text-blue-600 font-semibold">#{rank}</span></p>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-gray-700">Username:</label>
            <input
              type="text"
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>

            <label className="text-sm font-medium text-gray-700">Profile Picture (Upload)</label>
            <input
              type="file"
              accept="image/*"
              className="border p-2 rounded-md"
              onChange={handleImageUpload}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleUpdateProfile}
              className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </>
      ) : (
        <p className="text-lg text-gray-700 text-center">
          Viewing profile of <span className="font-semibold text-blue-600">{usernameUrl}</span>
        </p>
      )}
    </div>
  );
};

export default ProfilePage;