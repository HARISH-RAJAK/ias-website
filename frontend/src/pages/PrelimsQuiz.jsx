import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";

/**
 * =======================================================================
 * STITCH DESIGN PLACEHOLDER: 4. Daily Prelims Quiz – Test Engine
 * FILE PATH: frontend/src/pages/PrelimsQuiz.jsx
 * 
 * INSTRUCTIONS:
 * When you provide your Google Stitch code for the Prelims Quiz screen,
 * paste your Stitch JSX inside the designated STITCH CONTAINER below.
 * =======================================================================
 */

const PrelimsQuiz = () => {
  const [quizList, setQuizList] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const timerRef = useRef(null);

  // Default quiz with statement-based questions matching UPSC standards
  const defaultQuiz = {
    id: 1,
    title: "Daily UPSC Prelims Test: GS Paper I (Polity & Environment)",
    duration_minutes: 10,
    total_marks: 10,
    questions: [
      {
        id: 101,
        question_text: "With reference to the Governor's powers under Article 200 of the Indian Constitution, consider the following statements:\n1. The Governor can withhold assent to a Money Bill passed by the State Legislative Assembly.\n2. The Constitution does not prescribe a specific timeframe within which the Governor must declare assent.\n\nWhich of the statements given above is/are correct?",
        option_a: "1 only",
        option_b: "2 only",
        option_c: "Both 1 and 2",
        option_d: "Neither 1 nor 2",
        correct_option: "b",
        explanation: "Statement 1 is incorrect: The Governor can either give assent or reserve a Money Bill for the President, but cannot withhold assent to a Money Bill. Statement 2 is correct: Article 200 states 'as soon as possible', but no fixed calendar timeframe is prescribed in the text of the Constitution.",
        marks: 2,
      },
      {
        id: 102,
        question_text: "Consider the following statements regarding the 'Kunming-Montreal Global Biodiversity Framework':\n1. It aims to protect at least 30% of the world's lands and oceans by 2030 (30x30 target).\n2. India is a signatory party to this framework under the Convention on Biological Diversity (CBD).\n\nWhich of the statements given above is/are correct?",
        option_a: "1 only",
        option_b: "2 only",
        option_c: "Both 1 and 2",
        option_d: "Neither 1 nor 2",
        correct_option: "c",
        explanation: "Both statements are correct. The Kunming-Montreal Global Biodiversity Framework was adopted at COP15 to CBD in 2022, establishing 23 global targets for 2030, notably Target 3 (protect 30% of land and marine areas).",
        marks: 2,
      },
      {
        id: 103,
        question_text: "With reference to the Production Linked Incentive (PLI) Scheme in India, consider the following statements:\n1. It provides financial incentives on incremental sales of goods manufactured in domestic units.\n2. Semiconductor design and fabrication is one of the targeted focus areas under related incentive programs.\n\nWhich of the statements given above is/are correct?",
        option_a: "1 only",
        option_b: "2 only",
        option_c: "Both 1 and 2",
        option_d: "Neither 1 nor 2",
        correct_option: "c",
        explanation: "Both statements are correct. PLI schemes provide 4% to 6% incentives on incremental sales over a base year to scale domestic manufacturing capacity.",
        marks: 2,
      },
      {
        id: 104,
        question_text: "Consider the following protected areas:\n1. Bandipur National Park\n2. Mudumalai National Park\n3. Wayanad Wildlife Sanctuary\n\nAll three of the above protected areas form part of which of the following Biosphere Reserves?",
        option_a: "Agasthyamala Biosphere Reserve",
        option_b: "Nilgiri Biosphere Reserve",
        option_c: "Great Nicobar Biosphere Reserve",
        option_d: "Similipal Biosphere Reserve",
        correct_option: "b",
        explanation: "Bandipur (Karnataka), Mudumalai (Tamil Nadu), and Wayanad (Kerala) together with Nagarhole and Silent Valley form the Nilgiri Biosphere Reserve, India's first Biosphere Reserve established in 1986.",
        marks: 2,
      },
      {
        id: 105,
        question_text: "Which of the following bodies is constitutional in nature?\n1. National Commission for Scheduled Tribes\n2. NITI Aayog\n3. Central Vigilance Commission\n4. National Human Rights Commission",
        option_a: "1 only",
        option_b: "1 and 3 only",
        option_c: "2 and 4 only",
        option_d: "1, 2, 3 and 4",
        correct_option: "a",
        explanation: "Only the National Commission for Scheduled Tribes is a constitutional body (Article 338A). NITI Aayog is a non-statutory executive body; CVC and NHRC are statutory bodies created by Acts of Parliament.",
        marks: 2,
      },
    ],
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get("/quizzes");
        if (response.data?.data && response.data.data.length > 0) {
          setQuizList(response.data.data);
          setActiveQuiz(response.data.data[0]);
          setTimeLeft((response.data.data[0].duration_minutes || 10) * 60);
        } else {
          setActiveQuiz(defaultQuiz);
          setQuizList([defaultQuiz]);
          setTimeLeft(defaultQuiz.duration_minutes * 60);
        }
      } catch (err) {
        console.warn("Backend API unavailable, using offline fallback quiz:", err);
        setActiveQuiz(defaultQuiz);
        setQuizList([defaultQuiz]);
        setTimeLeft(defaultQuiz.duration_minutes * 60);
      }
    };

    fetchQuizzes();
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (activeQuiz && !isQuizCompleted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleCalculateScore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activeQuiz, isQuizCompleted, timeLeft]);

  const handleSelectOption = (questionId, optionLetter) => {
    if (isQuizCompleted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionLetter,
    }));
  };

  const handleCalculateScore = async () => {
    if (!activeQuiz) return;
    clearInterval(timerRef.current);

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;

    activeQuiz.questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (!selected) {
        unattemptedCount++;
      } else if (selected.toLowerCase() === q.correct_option.toLowerCase()) {
        correctCount++;
        totalScore += q.marks || 2;
      } else {
        incorrectCount++;
        totalScore -= 0.66; // UPSC CSE standard negative marking (1/3rd of 2 marks)
      }
    });

    const result = {
      totalQuestions: activeQuiz.questions.length,
      correctCount,
      incorrectCount,
      unattemptedCount,
      finalScore: Math.max(0, totalScore).toFixed(2),
      maxMarks: activeQuiz.total_marks || activeQuiz.questions.length * 2,
      accuracy:
        correctCount + incorrectCount > 0
          ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
          : 0,
    };

    setScoreResult(result);
    setIsQuizCompleted(true);

    // Save attempt to backend
    try {
      await api.post(`/quizzes/${activeQuiz.id}/submit`, {
        score: result.finalScore,
        total_questions: result.totalQuestions,
        correct_answers: correctCount,
        answers: selectedAnswers,
      });
    } catch {
      // Offline fallback
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setIsQuizCompleted(false);
    setScoreResult(null);
    setCurrentQuestionIndex(0);
    setTimeLeft((activeQuiz?.duration_minutes || 10) * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!activeQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentQuestion = activeQuiz.questions[currentQuestionIndex];

  return (
    <div className="prelims-quiz-page min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Heading */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
              UPSC Prelims Test Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-2">
              {activeQuiz.title}
            </h1>
          </div>

          {/* Real-time Countdown Timer */}
          <div className="flex items-center space-x-3 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-sm self-start sm:self-auto">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Time Left:</span>
            <span className={`text-xl font-mono font-bold ${timeLeft < 120 ? "text-red-400 animate-pulse" : "text-amber-400"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* =======================================================================
            STITCH CONTAINER: Daily Prelims Quiz – Test Engine
            Paste your Stitch-generated Prelims Quiz markup here.
            ======================================================================= */}
        
        {/* Results Screen */}
        {isQuizCompleted && scoreResult ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 sm:p-10 mb-8">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-4xl">🎯</span>
              <h2 className="text-2xl font-bold font-serif text-slate-900 mt-2">
                Quiz Evaluation Completed
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Here is your performance breakdown with standard UPSC negative marking.
              </p>

              {/* Score Highlight Box */}
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-200">
                <div className="text-4xl font-extrabold text-amber-800">
                  {scoreResult.finalScore} <span className="text-base text-gray-600 font-normal">/ {scoreResult.maxMarks}</span>
                </div>
                <div className="text-xs uppercase tracking-wider text-amber-900 font-bold mt-1">
                  Net Prelims Score
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <div className="text-2xl font-bold text-emerald-700">{scoreResult.correctCount}</div>
                <div className="text-xs text-emerald-800 font-medium mt-1">Correct (+2 each)</div>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
                <div className="text-2xl font-bold text-red-700">{scoreResult.incorrectCount}</div>
                <div className="text-xs text-red-800 font-medium mt-1">Incorrect (-0.66 each)</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-700">{scoreResult.unattemptedCount}</div>
                <div className="text-xs text-gray-600 font-medium mt-1">Unattempted</div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-700">{scoreResult.accuracy}%</div>
                <div className="text-xs text-blue-800 font-medium mt-1">Accuracy</div>
              </div>
            </div>

            {/* Questions Review & Explanations */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-bold font-serif text-slate-900 mb-6">
                Question Review & Detailed Explanations
              </h3>
              <div className="space-y-6">
                {activeQuiz.questions.map((q, idx) => {
                  const userAns = selectedAnswers[q.id];
                  const isCorrect = userAns && userAns.toLowerCase() === q.correct_option.toLowerCase();
                  return (
                    <div key={q.id} className="p-5 rounded-xl border border-gray-200 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500">Question {idx + 1}</span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                            !userAns
                              ? "bg-gray-100 text-gray-600"
                              : isCorrect
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {!userAns ? "Not Attempted" : isCorrect ? "Correct (+2)" : "Incorrect (-0.66)"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 whitespace-pre-line mb-3">
                        {q.question_text}
                      </p>
                      <div className="text-xs text-gray-600 space-y-1 mb-3">
                        <div>A) {q.option_a}</div>
                        <div>B) {q.option_b}</div>
                        <div>C) {q.option_c}</div>
                        <div>D) {q.option_d}</div>
                      </div>
                      <div className="p-3 bg-amber-50/70 rounded-lg text-xs border border-amber-200/80">
                        <p className="font-bold text-amber-900">
                          Correct Answer: Option {q.correct_option.toUpperCase()}
                        </p>
                        <p className="text-amber-800 mt-1 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleRestartQuiz}
                className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-semibold shadow"
              >
                Retake This Prelims Test
              </button>
            </div>
          </div>
        ) : (
          /* Live Test Engine Interface */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Question Screen (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 text-xs text-gray-500">
                  <span>
                    Question <strong className="text-slate-900 text-sm">{currentQuestionIndex + 1}</strong> of {activeQuiz.questions.length}
                  </span>
                  <span>
                    Marks: <strong className="text-slate-900">+{currentQuestion.marks || 2}</strong> | Negative: <strong className="text-red-600">-0.66</strong>
                  </span>
                </div>

                {/* Question text */}
                <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed whitespace-pre-line mb-8">
                  {currentQuestion.question_text}
                </div>

                {/* Options list */}
                <div className="space-y-3">
                  {[
                    { key: "a", text: currentQuestion.option_a },
                    { key: "b", text: currentQuestion.option_b },
                    { key: "c", text: currentQuestion.option_c },
                    { key: "d", text: currentQuestion.option_d },
                  ].map((opt) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleSelectOption(currentQuestion.id, opt.key)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3 ${
                          isSelected
                            ? "bg-amber-50 border-amber-600 ring-1 ring-amber-600 text-amber-950 font-medium"
                            : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 text-gray-800"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold uppercase shrink-0 mt-0.5 ${
                            isSelected
                              ? "bg-amber-700 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className="text-sm leading-normal">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedAnswers((prev) => {
                      const next = { ...prev };
                      delete next[currentQuestion.id];
                      return next;
                    });
                  }}
                  className="text-xs text-gray-500 hover:text-red-600"
                >
                  Clear Selection
                </button>

                {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={handleCalculateScore}
                    className="px-6 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow"
                  >
                    Submit Test Engine
                  </button>
                )}
              </div>
            </div>

            {/* Question Palette Sidebar (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4">
                Question Palette
              </h3>

              <div className="grid grid-cols-5 gap-2.5 mb-6">
                {activeQuiz.questions.map((q, idx) => {
                  const isAnswered = !!selectedAnswers[q.id];
                  const isCurrent = idx === currentQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-10 rounded-lg text-xs font-bold transition-all ${
                        isCurrent
                          ? "ring-2 ring-amber-600 ring-offset-2"
                          : ""
                      } ${
                        isAnswered
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded bg-emerald-600 shrink-0"></span>
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded bg-gray-100 border shrink-0"></span>
                  <span>Not Attempted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded border-2 border-amber-600 shrink-0"></span>
                  <span>Current Question</span>
                </div>
              </div>

              {/* Final Submit Button */}
              <div className="mt-8">
                <button
                  onClick={handleCalculateScore}
                  className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors text-center"
                >
                  Complete & Submit Test
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default PrelimsQuiz;

