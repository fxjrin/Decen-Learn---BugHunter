import Types "./Types";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Time "mo:base/Time";

module {
  public func authenticateUser(users : Types.Users, userId : Principal, username : Text) : Result.Result<Types.User, Text> {
    if (Text.size(username) < 3) {
      return #err("Username must be at least 3 characters long");
    };

    if (Principal.isAnonymous(userId)) { return #err("Invalid principal") };

    for ((id, user) in users.entries()) {
      if (Text.equal(user.username, username)) {
        if (id != userId) {
          return #err("USERNAME_TAKEN: The username '" # username # "' is already in use.");
        };
      };
    };

    switch (users.get(userId)) {
      case (?existingUser) { #ok(existingUser) };
      case (null) {
        let newUser : Types.User = {
          id = userId;
          username = username;
          xp = 0;
          name = null;
          bio = null;
          createdAt = Time.now();
          profilePicture = null;
          gameProgress = [];
        };

        users.put(userId, newUser);

        #ok(newUser);
      };
    };
  };

  public func updateUserProfile(users : Types.Users, userId : Principal, updateData : Types.UserUpdateData) : Result.Result<Types.User, Text> {
    if (Principal.isAnonymous(userId)) {
      return #err("Anonymous principals are not allowed");
    };

    switch (users.get(userId)) {
      case (null) { return #err("User not found!") };

      case (?user) {
        let username = switch (updateData.username) {
          case (null) { user.username };
          case (?newUsername) {
            if (Text.size(newUsername) < 3) {
              return #err("Username must be at least 3 characters long");
            };

            if (newUsername != user.username) {
              for ((id, existingUser) in users.entries()) {
                if (id != userId and Text.equal(existingUser.username, newUsername)) {
                  return #err("USERNAME_TAKEN: The username '" # newUsername # "'is already in use.");
                };
              };
            };
            newUsername;
          };
        };

        let name = switch (updateData.name) {
          case (null) { user.name };
          case (?newName) { ?newName };
        };

        let bio = switch (updateData.bio) {
          case (null) { user.bio };
          case (?newBio) {
            if (Text.size(newBio) > 100) {
              return #err("Bio must be 100 characters or less");
            };
            ?newBio;
          };
        };

        let profilePicture = switch (updateData.profilePicture) {
          case (null) { user.profilePicture };
          case (?newProfilePicture) { ?newProfilePicture };
        };

        let updatedUser : Types.User = {
          id = user.id;
          username = username;
          xp = user.xp;
          bio = bio;
          name = name;
          createdAt = user.createdAt;
          profilePicture = profilePicture;
          gameProgress = user.gameProgress;
        };

        users.put(userId, updatedUser);
        #ok(updatedUser);
      };
    };
  };

  public func getUserByUsername(users : Types.Users, username : Text) : ?Types.User {
    for ((principal, user) in users.entries()) {
      if (user.username == username) {
        return ?user;
      };
    };
    return null;
  };
};
