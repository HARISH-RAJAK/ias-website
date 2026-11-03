import React from "react";

const Header = () => {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-navy-900 text-gray-200 text-xs py-2 px-4 border-b border-navy-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center space-x-3">
          <span className="bg-amber-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
            UPSC 2026-27
          </span>
          <span className="text-gray-300 hidden sm:inline">
            Target CSE Prelims & Mains Preparation Program
          </span>
          <span className="text-amber-400 text-[11px] font-medium animate-pulse">
            ● Daily Current Affairs & Editorial Updated
          </span>
        </div>

        <div className="flex items-center space-x-4 text-gray-400 text-[11px]">
          <span>{currentDate}</span>
          <span className="hidden md:inline">|</span>
          <a
            href="https://upsc.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-300 transition-colors hidden md:inline"
          >
            UPSC Official Portal ↗
          </a>
          <span className="hidden md:inline">|</span>
          <span className="text-gray-300">Helpline: +91 98765 43210</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

