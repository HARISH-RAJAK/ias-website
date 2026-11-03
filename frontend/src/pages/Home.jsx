import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/**
 * =======================================================================
 * STITCH DESIGN PLACEHOLDER: 1. Home – Sankalp IAS Preparation Portal
 * FILE PATH: frontend/src/pages/Home.jsx
 * 
 * INSTRUCTIONS:
 * When you provide your Google Stitch code for the Home screen,
 * paste your Stitch JSX inside the designated STITCH CONTAINER below.
 * =======================================================================
 */

const Home = () => {
  const [stats, setStats] = useState({
    activeAspirants: "45,000+",
    dailyQuizzesAttempted: "1,200+",
    mainsAnswersEvaluated: "850+",
    editorialCoverage: "100%",
  });
  const [dailyHighlights, setDailyHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch latest daily updates from backend
    const fetchHomeData = async () => {
      try {
        const response = await api.get("/current-affairs?limit=3");
        if (response.data?.data) {
          setDailyHighlights(response.data.data);
        }
      } catch (error) {
        console.warn("Using offline fallback for home highlights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-page min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-gray-50">
      
      {/* =======================================================================
          STITCH CONTAINER: Home - Sankalp IAS Preparation Portal
          Paste your Stitch-generated Home markup into this section.
          ======================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-4 border border-amber-200">
              🇮🇳 UPSC Civil Services Examination 2026-27
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
              Sankalp IAS Preparation Portal
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
              Your comprehensive ecosystem for UPSC CSE preparation. Master General Studies with our daily current affairs, targeted prelims test engine, and secure mains answer writing mentorship.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/prelims-quiz"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all text-center"
              >
                Start Today's Prelims Quiz ⏱️
              </Link>
              <Link
                to="/mains-answer-writing"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white hover:bg-gray-50 text-slate-800 font-semibold border border-gray-300 shadow-sm transition-all text-center"
              >
                Daily Mains Answer Writing ✍️
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">{stats.activeAspirants}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Active Aspirants</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.dailyQuizzesAttempted}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Daily Quizzes Taken</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">{stats.mainsAnswersEvaluated}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Mains Answers Evaluated</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.editorialCoverage}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Syllabus Mapping</div>
            </div>
          </div>

          {/* Three Core Pillars Cards */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                Core Preparation Pillars
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Structured methodology aligned with the latest UPSC CSE trend
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl mb-6">
                    📰
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif">
                    Daily Current Affairs & Editorials
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    Comprehensive breakdown of The Hindu, Indian Express, and PIB. Categorized by GS Papers I to IV with key takeaways, prelims pointers, and mains analytical dimensions.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    to="/current-affairs"
                    className="text-amber-700 hover:text-amber-800 font-semibold text-sm inline-flex items-center"
                  >
                    Explore Today's Analysis →
                  </Link>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl mb-6">
                    ⏱️
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif">
                    Prelims Quiz & Test Engine
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    Practice exam-standard MCQs with statement-based questions, negative marking simulation, detailed explanations, and instant score breakdowns.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    to="/prelims-quiz"
                    className="text-amber-700 hover:text-amber-800 font-semibold text-sm inline-flex items-center"
                  >
                    Take Timed Test Engine →
                  </Link>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mb-6">
                    ✍️
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif">
                    Secure Mains Answer Writing
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    Daily GS 1-4 analytical questions with strict word count tracking, peer reviews, model answers, and expert synopsis framework.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    to="/mains-answer-writing"
                    className="text-amber-700 hover:text-amber-800 font-semibold text-sm inline-flex items-center"
                  >
                    View Daily Questions & Synopsis →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Highlights Banner */}
          <div className="mt-16 bg-gradient-to-r from-slate-900 to-navy-900 text-white rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase">
                  Daily Habit Tracker
                </span>
                <h3 className="text-2xl font-bold font-serif text-white mt-1">
                  Consistency is the Key to UPSC Civil Services
                </h3>
                <p className="text-gray-300 text-sm mt-2 max-w-xl">
                  Solve 5 MCQs, read 3 editorial summaries, and draft 1 Mains answer every day. Track your consistency on your personalized dashboard.
                </p>
              </div>
              <Link
                to="/register"
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg shadow transition-colors whitespace-nowrap"
              >
                Create Free Aspirant Account
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* STITCH HOME DESIGN INJECTION POINT:
          Replace or supplement the section above when pasting Stitch code */}
    </div>
  );
};

export default Home;

