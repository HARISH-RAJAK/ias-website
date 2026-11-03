import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white font-serif font-bold text-lg">
                सं
              </div>
              <span className="text-xl font-bold font-serif tracking-tight text-white">
                SANKALP <span className="text-amber-500">IAS</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering civil service aspirants nationwide with curated daily current affairs, analytical mains answer writing initiatives, and high-yield prelims test engines.
            </p>
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} Sankalp IAS Portal. All rights reserved.
            </div>
          </div>

          {/* Quick Pillars */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-500 mb-4">
              Core Preparation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/current-affairs" className="hover:text-white transition-colors">
                  Daily Current Affairs & Editorials
                </Link>
              </li>
              <li>
                <Link to="/prelims-quiz" className="hover:text-white transition-colors">
                  Daily Prelims Quiz Engine
                </Link>
              </li>
              <li>
                <Link to="/mains-answer-writing" className="hover:text-white transition-colors">
                  Secure Mains Answer Writing & Synopsis
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Foundation & Mentorship Courses
                </Link>
              </li>
              <li>
                <Link to="/study-materials" className="hover:text-white transition-colors">
                  UPSC Syllabus & Standard Reference Notes
                </Link>
              </li>
            </ul>
          </div>

          {/* General Studies Segments */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-500 mb-4">
              GS Modules
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>GS Paper I – Heritage, History & Geography</li>
              <li>GS Paper II – Governance, Polity & IR</li>
              <li>GS Paper III – Economy, Science & Ecology</li>
              <li>GS Paper IV – Ethics, Integrity & Aptitude</li>
              <li>Essay Paper Guidance & Model Tests</li>
            </ul>
          </div>

          {/* Connect & Disclaimer */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-500 mb-4">
              Academic Support
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Have questions regarding course admissions or daily evaluation? Reach our academic counseling desk.
            </p>
            <div className="text-sm text-gray-300">
              <p>Email: <span className="text-amber-400">mentorship@sankalpias.in</span></p>
              <p>Support: <span className="text-amber-400">+91 98765 43210</span></p>
            </div>
            <p className="text-[11px] text-gray-400 leading-tight">
              Disclaimer: Sankalp IAS is an educational resource platform for UPSC CSE aspirants and is not affiliated with the Union Public Service Commission.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

