import React from "react";
import Button from "./Button";

const CoursesPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
        Learn Programming <span className="text-blue-400">Decentralized</span>
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
        Decen Learn allows you to master various programming languages in a decentralized way. 
        Earn blockchain-based NFT certificates for your achievements.  
      </p>
      <p className="mt-2 text-lg md:text-xl text-gray-300 font-semibold">
        This service is coming soon!
      </p>
      <Button variant="blue" onClick={() => window.navigate("/")}>
        Back to Home
      </Button>
    </div>
  );
};

export default CoursesPage;
