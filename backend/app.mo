import LLM "mo:llm";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Types "./Types";
import UserService "./UserService";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";

actor {
  private var users : Types.Users = HashMap.HashMap(0, Principal.equal, Principal.hash);
  private var challenges: HashMap.HashMap<Nat, Types.Challenge> = HashMap.HashMap(10, Nat.equal, func (n: Nat) : Nat32 { Nat32.fromNat(n) });

  private stable var stableUsers : [(Principal, Types.User)] = [];
  private stable var stableChallenges: [(Nat, Types.Challenge)] = [];

  // PREUPGRADE & POSTUPGRADE
  system func preupgrade() {
    stableUsers := Iter.toArray(users.entries());
    stableChallenges := Iter.toArray(challenges.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Principal, Types.User>(stableUsers.vals(), 0, Principal.equal, Principal.hash);
    challenges := HashMap.fromIter<Nat, Types.Challenge>(stableChallenges.vals(), 10, Nat.equal, func (n: Nat) : Nat32 { Nat32.fromNat(n) });
    stableUsers := [];
    stableChallenges := [];
  };

  public shared (message) func authenticateUser(username : Text) : async Result.Result<Types.User, Text> {
    return UserService.authenticateUser(users, message.caller, username);
  };

  public shared (message) func updateUserProfile(updateData : Types.UserUpdateData) : async Result.Result<Types.User, Text> {
    return UserService.updateUserProfile(users, message.caller, updateData);
  };

  public query (message) func whoami() : async Principal {
    message.caller;
  };

  public query func getUserByUsername(username : Text) : async ?Types.User {
    return UserService.getUserByUsername(users, username);
  };

  public query func getUserByPrincipal(userId : Principal) : async ?Types.User {
    return users.get(userId);
  };

  public func prompt(prompt : Text) : async Text {
    await LLM.prompt(#Llama3_1_8B, prompt);
  };

  public func chat(messages : [LLM.ChatMessage]) : async Text {
    await LLM.chat(#Llama3_1_8B, messages);
  };

  public query func getAllUsers() : async [(Principal, Types.User)] {
    return Iter.toArray(users.entries());
  };


  public func initChallenges() : async () {
    let initialChallenges = [
      (1, {
        id = 1;
        code = "function sayHello() {\n  console.log(\"Hello, world!\");\n}\n\nsayHelo();";
        description = "Find the bug in this JavaScript code.";
        solution = "sayHelo should be sayHello";
        language = "JavaScript";
      }),

      (2, {
        id = 2;
        code = "let isEven = (num) => {\n  return num % 2 === 1;\n};\nconsole.log(isEven(4));";
        description = "This function should check if a number is even, but it returns the wrong result.";
        solution = "num % 2 should be compared to 0, not 1";
        language = "JavaScript";
      }),

      (3, {
        id = 3;
        code = "let i = 0;\nwhile (i < 5) {\n  console.log(i);\n}";
        description = "This loop runs infinitely. Identify the problem.";
        solution = "Missing increment i++ inside the loop";
        language = "JavaScript";
      }),

      (4, {
        id = 4;
        code = "function greet() {\n  message = \"Hello!\";\n  console.log(message);\n}\ngreet();";
        description = "This function causes an error in strict mode. Find the issue.";
        solution = "message should be declared with let or const";
        language = "JavaScript";
      }),

      (5, {
        id = 5;
        code = "const numbers = [1, 2, 3, 4, 5];\nnumbers.pop(2);\nconsole.log(numbers);";
        description = "The function is supposed to remove an element, but it's not working as expected.";
        solution = "pop() does not take an argument, use splice(2,1) instead";
        language = "JavaScript";
      }),

      (6, {
        id = 6;
        code = "function factorial(n) {\n  if (n === 0) return 1;\n  return n * factorial(n - 1);\n}\nconsole.log(factorial(-1));";
        description = "This recursive function does not handle negative input correctly.";
        solution = "Add a base case to check for n < 0";
        language = "JavaScript";
      }),

      (7, {
        id = 7;
        code = "class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    console.log(this.name + \" makes a noise.\");\n  }\n}\nconst dog = new Animal(\"Dog\");\nconst speakFn = dog.speak;\nspeakFn();";
        description = "Why does this code result in an error when calling speakFn()?";
        solution = "this is undefined; bind speakFn to dog using speakFn = dog.speak.bind(dog)";
        language = "JavaScript";
      }),

      (8, {
        id = 8;
        code = "let data = 0;\nasync function fetchData() {\n  setTimeout(() => { data = 10; }, 1000);\n  return data;\n}\nfetchData().then(console.log);";
        description = "Why does fetchData() not return 10 as expected?";
        solution = "setTimeout is async, fetchData should return a Promise with data after the timeout";
        language = "JavaScript";
      }),

      (9, {
        id = 9;
        code = "const uniqueNumbers = new Set([1, 2, 3, 3, 4]);\nconsole.log(uniqueNumbers.length);";
        description = "Why does this code not log the correct length?";
        solution = "Set does not have a length property, use uniqueNumbers.size instead";
        language = "JavaScript";
      }),

      (10, {
        id = 10;
        code = "const users = [{ id: 1, name: \"Alice\" }, { id: 2, name: \"Bob\" }];\nconst userMap = {};\nusers.forEach(user => userMap.user.id = user.name);\nconsole.log(userMap);";
        description = "This code should map user IDs to names, but it's not working.";
        solution = "userMap.user.id should be userMap[user.id]";
        language = "JavaScript";
      }),

      (11, {
        id = 1;
        code = "print(\"Hello, world!\")\nprint(Hello World)";
        description = "Find the bug in this Python code.";
        solution = "Missing quotes around 'Hello World' in the second print statement";
        language = "Python";
      }),
      
      (12, {
        id = 2;
        code = "def is_even(n):\n    return n % 2 == 1\nprint(is_even(4))";
        description = "This function should check if a number is even, but it returns the wrong result.";
        solution = "n % 2 should be compared to 0, not 1";
        language = "Python";
      }),
      
      (13, {
        id = 3;
        code = "i = 0\nwhile i < 5:\n    print(i)";
        description = "This loop runs infinitely. Identify the problem.";
        solution = "Missing increment 'i += 1' inside the loop";
        language = "Python";
      }),
      
      (14, {
        id = 4;
        code = "def greet():\n    message = \"Hello!\"\n    print(message)\n\ngreet()";
        description = "This function may cause an error in some scenarios. Find the issue.";
        solution = "If using global variables, message should be declared as 'global message'";
        language = "Python";
      }),
      
      (15, {
        id = 5;
        code = "numbers = [1, 2, 3, 4, 5]\nnumbers.remove(6)\nprint(numbers)";
        description = "This code is supposed to remove an element, but it's not working.";
        solution = "6 is not in the list; use 'if 6 in numbers: numbers.remove(6)'";
        language = "Python";
      }),
      
      (16, {
        id = 6;
        code = "def factorial(n):\n    if n == 0: return 1\n    return n * factorial(n - 1)\nprint(factorial(-1))";
        description = "This recursive function does not handle negative input correctly.";
        solution = "Add a base case to check for n < 0";
        language = "Python";
      }),
      
      (17, {
        id = 7;
        code = "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        print(self.name + \" makes a noise.\")\n\ndog = Animal(\"Dog\")\nspeakFn = dog.speak\nspeakFn()";
        description = "Why does this code result in an error when calling speakFn()?";
        solution = "self is not passed; use 'speakFn = dog.speak.__get__(dog)'";
        language = "Python";
      }),
      
      (18, {
        id = 8;
        code = "import threading\ncount = 0\ndef increment():\n    global count\n    for _ in range(1000000):\n        count += 1\nt1 = threading.Thread(target=increment)\nt2 = threading.Thread(target=increment)\nt1.start()\nt2.start()\nt1.join()\nt2.join()\nprint(count)";
        description = "Why does this code sometimes print an incorrect count?";
        solution = "Race condition; use threading.Lock() to synchronize access";
        language = "Python";
      }),
      
      (19, {
        id = 9;
        code = "from collections import Counter\nnums = [1, 2, 2, 3, 3, 3, 4]\ncounter = Counter(nums)\nprint(counter[5])";
        description = "Why does this code return an error when accessing counter[5]?";
        solution = "Counter returns 0 for missing keys, no error should occur";
        language = "Python";
      }),
      
      (20, {
        id = 10;
        code = "def longest_palindrome(s):\n    for i in range(len(s)):\n        for j in range(i, len(s)):\n            substr = s[i:j+1]\n            if substr == substr[::-1]:\n                return substr\nprint(longest_palindrome(\"babad\"))";
        description = "This function should return the longest palindrome, but it's not correct.";
        solution = "Fix logic: Instead of returning first palindrome found, store max length palindrome";
        language = "Python";
      })
    ];

    for (entry in initialChallenges.vals()) {
      challenges.put(entry.0, entry.1);
    };
  };

  public shared ({caller}) func checkAnswer(challengeId: Nat, userAnswer: Text) : async Result.Result<Text, Text> {
    switch (challenges.get(challengeId)) {
      case (null) { return #err("Challenge not found"); };
      case (?challenge) {
        let messages : [LLM.ChatMessage] = [
          {
            role = #system_;
            content = "You are a code validation assistant. Respond only with \"true\" if the user correctly identifies the bug in the code, or \"false\" if they are incorrect. The bug is: " # challenge.solution;
          },
          {
            role = #user;
            content = "Code with bug: \n" # challenge.code # "\n\nUser's answer: \"" # userAnswer # "\"\n\nIs the user correct? Reply with only \"true\" or \"false\".";
          }
        ];

        let response = await LLM.chat(#Llama3_1_8B, messages);

        if (Text.equal(response, "true")) {
          switch (users.get(caller)) {
            case (?user) {
              let challengeKey = challenge.language # ":" # Nat.toText(challengeId);

              if (Array.find<Text>(user.gameProgress, func(x) { x == challengeKey }) == null) {
                let gainedXp = 1 + (challengeId - 1) * 2;
                let updatedUser = {
                  id = user.id;
                  username = user.username;
                  xp = user.xp + gainedXp;
                  name = user.name;
                  bio = user.bio;
                  createdAt = user.createdAt;
                  profilePicture = user.profilePicture;
                  gameProgress = Array.append<Text>(user.gameProgress, [challengeKey]);
                };

                users.put(caller, updatedUser);
              };
            };
            case (null) {};
          };
        };

        return #ok(response);
      };
    };
  };

  public query func getChallenges() : async [(Nat, Types.Challenge)] {
    Iter.toArray(challenges.entries());
  };
};
