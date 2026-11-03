import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    quizzesTaken: 14,
    averagePrelimsScore: "78%",
    mainsSubmitted: 6,
    mainsEvaluated: 4,
    streakDays: 12,
  });

  const recentQuizzes = [
    { title: "Daily Prelims Test: Polity & Environment", score: "8.68 / 10", date: "Today", status: "Evaluated" },
    { title: "Daily Prelims Test: Economy & Modern History", score: "7.34 / 10", date: "Yesterday", status: "Evaluated" },
    { title: "Weekly Full Length CSAT Paper II", score: "88 / 200", date: "2 Nov 2026", status: "Passed" },
  ];

  const recentMains = [
    { question: "Constitutional tensions between Governor and State Cabinets", paper: "GS-2", wordCount: 242, status: "Evaluated (Score: 9/15)", feedback: "Excellent structure and citations of Sarkaria Commission." },
    { question: "PLI schemes and high-tech manufacturing bottlenecks", paper: "GS-3", wordCount: 148, status: "Under Faculty Review", feedback: "Pending peer review." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-900 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                Aspirant Command Center
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif mt-1">
                Welcome back, {user?.name || "Aspirant"}!
              </h1>
              <p className="text-gray-300 text-sm mt-1">
                Preparation Streak: <strong className="text-amber-400">🔥 {stats.streakDays} Consecutive Days</strong>. Keep your consistency sharp today!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/prelims-quiz"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow transition-colors"
              >
                Take Today's Quiz
              </Link>
              <Link
                to="/mains-answer-writing"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Submit Mains Answer
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Left Column: Sidebar Component */}
          <div className="md:col-span-1">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Right Column: Tab Content */}
          <div className="md:col-span-3 space-y-6">
            
            {/* Overview Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-slate-900">{stats.quizzesTaken}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Prelims Tests Taken</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-emerald-600">{stats.averagePrelimsScore}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Avg Test Accuracy</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-amber-700">{stats.mainsSubmitted}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Mains Answers Drafted</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{stats.mainsEvaluated}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Faculty Evaluated</div>
              </div>
            </div>

            {/* Recent Prelims Tests Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 font-serif text-base">
                  Recent Prelims Test Engine Attempts
                </h3>
                <Link to="/prelims-quiz" className="text-xs text-amber-700 hover:text-amber-800 font-semibold">
                  Launch Engine →
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentQuizzes.map((q, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <p className="font-semibold text-gray-800">{q.title}</p>
                      <span className="text-gray-400 text-xs">{q.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-amber-700">{q.score}</span>
                      <div className="text-[11px] text-emerald-600 font-medium">{q.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Mains Submissions Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 font-serif text-base">
                  Mains Secure Answer Writing Submissions
                </h3>
                <Link to="/mains-answer-writing" className="text-xs text-amber-700 hover:text-amber-800 font-semibold">
                  New Submission →
                </Link>
              </div>
              <div className="space-y-4">
                {recentMains.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs sm:text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{m.paper} Question</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {m.status}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium">{m.question}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      <strong>Mentor Feedback:</strong> {m.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

