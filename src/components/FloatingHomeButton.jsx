import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const FloatingHomeButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link to="/" aria-label="Home">
        <button className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
          <Home className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
};

export default FloatingHomeButton;
