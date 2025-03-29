import React from "react";
import Button from "./Button";

const HomePage = () => {
  return (
    <div className="min-h-screen text-light flex flex-col items-center">
      <section className="w-full max-w-4xl text-center py-20 px-6">
        <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
          Play & Learn with <span className="text-blue-400">Bug Hunter AI</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Hone your programming skills by catching bugs with AI-powered challenges.
        </p>
        <br/>
        <Button variant="blue" onClick={() => window.navigate("/games")}>Start Playing</Button>
      </section>

    </div>
  );
};

export default HomePage;