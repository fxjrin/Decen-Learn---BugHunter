import React, { useEffect, useState } from "react";
import Button from "./Button";

const languages = ["JavaScript", "Python"];
const levels = [
  { id: 1, name: "🐜 Ant" },
  { id: 2, name: "🐞 Ladybug" },
  { id: 3, name: "🦟 Mosquito" },
  { id: 4, name: "🦗 Cricket" },
  { id: 5, name: "🪰 Fly" },
  { id: 6, name: "🐝 Wasp" },
  { id: 7, name: "🕷 Spider" },
  { id: 8, name: "🦂 Scorpion" },
  { id: 9, name: "🪲 Beetle" },
  { id: 10, name: "🪳 Cockroach" },
];

const BugHunter = ({ actor, user }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  const currentChallenge = challenges.find(
    (challenge) => challenge.id === Number(selectedLevel)
  );

  useEffect(() => {
    if (user && user.gameProgress && selectedLanguage) {
      const completed = user.gameProgress
        .filter((progress) => progress.startsWith(selectedLanguage + ":"))
        .map((progress) => Number(progress.split(":")[1]));

      setCompletedChallenges(completed);
    }
  }, [user, selectedLanguage]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const fetchedChallenges = await actor.getChallenges();

        const formattedChallenges = fetchedChallenges
          .map((challenge) => ({
            ...challenge[1],
            id: Number(challenge[1].id),
          }))
          .filter((challenge) => challenge.language === selectedLanguage); // Filter berdasarkan bahasa

        setChallenges(formattedChallenges);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };

    if (selectedLanguage) {
      fetchChallenges();
    }
  }, [actor, selectedLanguage]);

  const resetChallenge = () => {
    setUserAnswer("");
    setResult(null);
  };

  useEffect(() => {
    resetChallenge();
  }, [selectedLevel]);

  const nextLevel = () => {
    const currentIndex = levels.findIndex(
      (level) => level.id === selectedLevel
    );
    if (currentIndex !== -1 && currentIndex < levels.length - 1) {
      setSelectedLevel(levels[currentIndex + 1].id);
    } else {
      setSelectedLevel(null);
    }
    resetChallenge();
  };

  const checkAnswer = async () => {
    if (!userAnswer.trim()) return;

    setIsChecking(true);
    try {
      const response = await actor.checkAnswer(
        currentChallenge.id,
        userAnswer
      );
      const isCorrect = response.ok === "true";
      setResult(isCorrect ? "true" : "false");

      if (isCorrect) {
        if (!completedChallenges.includes(currentChallenge.id)) {
          setCompletedChallenges([...completedChallenges, currentChallenge.id]);
        }
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    } finally {
      setIsChecking(false);
    }
  };

    return (
  <div className="container mx-auto p-4 max-w-4xl">
    {!selectedLanguage ? (
      <div>
        <h2 className="text-3xl font-bold text-center mb-6">
          Choose your hunting ground!
        </h2>
        <div className="flex justify-center mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {languages.map((lang) => (
              <div
                key={lang}
                className="cursor-pointer border-2 rounded-lg shadow-lg flex flex-col items-center justify-center p-6 transition duration-200 hover:bg-gray-200"
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang === "JavaScript" ? (
                  <img src="/javascript.svg" alt="JavaScript Logo" width="50" height="50" />
                ) : lang === "Python" ? (
                  <img src="/python.svg" alt="Python Logo" width="50" height="50" />
                ) : (
                  <span className="text-4xl">📜</span> // Placeholder jika bahasa lain
                )}
                <h3 className="text-xl font-bold">{lang}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : !selectedLevel ? (
      <div>
        <h2 className="text-3xl font-bold text-center mb-6">
          Choose a challenge level ({selectedLanguage})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 justify-center">
          {levels.map((level) => (
            <button
              key={level.id}
              className={`w-40 h-40 border-2 rounded-lg shadow-lg flex flex-col items-center justify-center gap-2 transition duration-200 ${
                completedChallenges.includes(level.id)
                  ? "bg-green-500 text-white"
                  : "border-gray-300 hover:bg-gray-200"
              }`}
              onClick={() => {
                setSelectedLevel(level.id);
                resetChallenge();
              }}
            >
              <span className="text-4xl">{level.name.split(" ")[0]}</span>
              <h3 className="text-xl font-bold">
                {level.name.split(" ")[1]}
              </h3>
            </button>
          ))}
        </div>
        <div className="text-center mt-6">
          <Button variant="gray" onClick={() => setSelectedLanguage(null)}>
            Back
          </Button>
        </div>
      </div>
    ) : (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          Bug Hunter: Level {selectedLevel}
        </h2>
        <p className="text-center text-lg">
          Language: <strong>{selectedLanguage}</strong>
        </p>

        {currentChallenge && currentChallenge.language === selectedLanguage ? (
          <div className="bg-gray-100 p-6 rounded-lg mt-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {currentChallenge.description}
            </h3>
            <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-auto">
              {currentChallenge.code}
            </pre>
            <input
              type="text"
              placeholder="Describe the bug here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full border rounded-md p-3 mt-4 text-lg"
            />
            <div className="flex justify-between mt-4">
              <Button
                variant="gray"
                onClick={() => {
                  setSelectedLevel(null);
                  resetChallenge();
                }}
              >
                Back to level selection
              </Button>

              {result === "true" && (
                <div className="text-center mt-4">
                  <Button variant="green" onClick={nextLevel}>
                    Next Level
                  </Button>
                </div>
              )}

              {result !== "true" && (
                <Button
                  variant="blue"
                  onClick={checkAnswer}
                  disabled={isChecking}
                >
                  {isChecking ? "Checking..." : "Check"}
                </Button>
              )}
            </div>
            {result && (
              <p
                className={`text-center mt-4 text-lg font-bold ${
                  result === "true" ? "text-green-500" : "text-red-500"
                }`}
              >
                {result === "true"
                  ? "✅ Correct Answer!"
                  : "❌ Wrong Answer!"}
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-red-500">
            No challenge found for this level in {selectedLanguage}.
          </p>
        )}
      </div>
    )}
  </div>
);
};

export default BugHunter;
