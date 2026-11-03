import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl font-serif font-extrabold text-amber-700">404</div>
        <h1 className="mt-4 text-2xl font-bold font-serif text-slate-900">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          The UPSC study resource or page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Return to Homepage
          </Link>
          <Link
            to="/current-affairs"
            className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-slate-800 rounded-lg text-sm font-semibold transition-colors"
          >
            Daily Current Affairs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

