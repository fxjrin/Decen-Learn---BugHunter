import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";

module {
  public type Users = HashMap.HashMap<Principal, User>;

  public type User = {
    id : Principal;
    username : Text;
    xp : Nat;
    name : ?Text;
    bio : ?Text;
    createdAt : Int;
    profilePicture : ?Text;
    gameProgress: [Text];
  };

  public type UserUpdateData = {
    username : ?Text;
    name : ?Text;
    bio : ?Text;
    profilePicture : ?Text;
  };

  public type Challenge = {
    id: Nat;
    code: Text;
    description: Text;
    solution: Text;
    language: Text;
  };
};
