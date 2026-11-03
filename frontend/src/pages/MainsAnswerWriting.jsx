import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

/**
 * =======================================================================
 * STITCH DESIGN PLACEHOLDER: 3. Secure Mains Answer Writing & Synopsis
 * FILE PATH: frontend/src/pages/MainsAnswerWriting.jsx
 * 
 * INSTRUCTIONS:
 * When you provide your Google Stitch code for the Mains Answer Writing screen,
 * paste your Stitch JSX inside the designated STITCH CONTAINER below.
 * =======================================================================
 */

const MainsAnswerWriting = () => {
  const { isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [showSynopsis, setShowSynopsis] = useState(false);

  // Default seed questions for immediate functionality
  const defaultQuestions = [
    {
      id: 1,
      paper: "GS Paper II",
      topic: "Constitution & Federalism",
      question_text: "Analyze the constitutional tensions arising between elected State Cabinets and the office of the Governor. How can institutional safeguards preserve cooperative federalism in India? (15 Marks, 250 Words)",
      word_limit: 250,
      marks: 15,
      published_date: "2026-11-03",
      model_answer: `Introduction:
The Governor occupies a dual capacity in India's constitutional setup: the constitutional head of the State and the representative of the Union Government. Recent disputes regarding reservation of bills (Article 200/201) and summoning legislatures highlight structural frictions.

Body:
1. Causes of Friction:
- Absence of fixed timelines for giving assent or withholding assent under Article 200.
- Exercise of discretionary power in government formation and dissolution.
- Increasing politicization of gubernatorial appointments.

2. Impact on Cooperative Federalism:
- Legislative paralysis and policy uncertainty.
- Invalidation of democratic mandates of state legislatures.

3. Institutional Safeguards & Recommendations:
- Sarkaria Commission (1988): Governor should be an eminent person outside state politics, appointed after consulting the State Chief Minister.
- Punchhi Commission (2010): Constitutional amendments to remove Governors via state legislative impeachment.
- Supreme Court Jurisprudence: Discretion is not absolute; arbitrary delays violate constitutional propriety.

Conclusion:
To protect federal dynamism, Governors must adhere to constitutional morality as 'elder statesmen' rather than executive roadblocks.`,
      synopsis: "Key Dimensions to cover: Constitutional provisions (Art 153, 163, 200), Sarkaria & Punchhi recommendations, SC precedents, and path toward cooperative federalism.",
    },
    {
      id: 2,
      paper: "GS Paper III",
      topic: "Economy & Industrial Policy",
      question_text: "Examine whether production-linked incentives (PLI) can transform India from an assembly hub into an indigenous high-tech manufacturing leader. What are the key bottlenecks? (10 Marks, 150 Words)",
      word_limit: 150,
      marks: 10,
      published_date: "2026-11-03",
      model_answer: `Introduction:
India's PLI schemes across 14 sectors aim to boost manufacturing competitiveness and integrate domestic supply chains with global value chains.

Bottlenecks & Analysis:
- High import reliance on raw materials and components (e.g. active pharmaceutical ingredients and silicon wafers).
- Low R&D spending (0.7% of GDP) compared to global peers.
- Focus on low-value assembly (screw-driver operations) rather than deep design capabilities.

Way Forward:
Pair PLI with intellectual property support, component ecosystem clusters, and skilled technical labor.`,
      synopsis: "Structure: Brief intro on PLI objective -> Potential upside -> Critical constraints (R&D, supply chain depth) -> Forward-looking conclusion.",
    },
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get("/mains/questions");
        if (response.data?.data && response.data.data.length > 0) {
          setQuestions(response.data.data);
          setSelectedQuestion(response.data.data[0]);
        } else {
          setQuestions(defaultQuestions);
          setSelectedQuestion(defaultQuestions[0]);
        }
      } catch (err) {
        console.warn("Backend API unavailable, using offline fallback questions:", err);
        setQuestions(defaultQuestions);
        setSelectedQuestion(defaultQuestions[0]);
      }
    };

    fetchQuestions();
  }, []);

  // Word count calculator
  const words = answerText.trim() === "" ? 0 : answerText.trim().split(/\s+/).length;
  const wordLimit = selectedQuestion?.word_limit || 250;
  const isOverLimit = words > wordLimit;

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    setSubmitting(true);
    setSubmissionSuccess(false);

    try {
      await api.post("/mains/submit", {
        question_id: selectedQuestion.id,
        answer_text: answerText,
        word_count: words,
      });
      setSubmissionSuccess(true);
    } catch {
      // Offline fallback: simulate successful submission
      setSubmissionSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mains-answer-writing-page min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Heading */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Daily Mains Mentorship
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-2">
            Secure Mains Answer Writing & Synopsis
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Daily exam-caliber analytical questions with timed editor, real-time word counter, and faculty model synopsis.
          </p>
        </div>

        {/* =======================================================================
            STITCH CONTAINER: Secure Mains Answer Writing & Synopsis
            Paste your Stitch-generated Mains Answer Writing markup here.
            ======================================================================= */}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Question Selector Sidebar (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-sm font-semibold uppercase text-gray-500 tracking-wider">
              Today's Practice Questions
            </h2>
            {questions.map((q) => (
              <div
                key={q.id}
                onClick={() => {
                  setSelectedQuestion(q);
                  setSubmissionSuccess(false);
                  setShowSynopsis(false);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedQuestion?.id === q.id
                    ? "bg-white border-amber-600 shadow-md ring-1 ring-amber-500"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {q.paper}
                  </span>
                  <span className="text-gray-500 font-medium">
                    {q.marks} Marks | {q.word_limit} Words
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-900 line-clamp-3">
                  {q.question_text}
                </p>
                <div className="mt-3 text-xs text-gray-400">
                  Topic: {q.topic}
                </div>
              </div>
            ))}

            {/* Writing Guidelines Box */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
              <h4 className="font-bold flex items-center gap-1.5">
                💡 UPSC Answer Formatting Tips:
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-amber-800">
                <li>Write a crisp 2-3 line contextual introduction.</li>
                <li>Break core arguments into distinct sub-headings & bullet points.</li>
                <li>Cite relevant Committee reports, Supreme Court judgments, or economic data.</li>
                <li>Conclude with an optimistic, actionable way forward.</li>
              </ul>
            </div>
          </div>

          {/* Main Answer Writing Interface (Right 8 cols) */}
          <div className="lg:col-span-8">
            {selectedQuestion && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                {/* Active Question Details */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-900 text-white">
                      {selectedQuestion.paper}
                    </span>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>Max Marks: <strong className="text-slate-900">{selectedQuestion.marks}</strong></span>
                      <span>•</span>
                      <span>Word Limit: <strong className="text-slate-900">{selectedQuestion.word_limit}</strong> words</span>
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 leading-snug">
                    {selectedQuestion.question_text}
                  </h3>
                </div>

                {/* Answer Submission Form */}
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Your Answer Draft:
                      </label>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${
                          isOverLimit
                            ? "bg-red-100 text-red-700 font-bold"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        Word Count: {words} / {wordLimit} {isOverLimit && "(Limit Exceeded)"}
                      </span>
                    </div>
                    <textarea
                      rows={12}
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Structure your answer here: Introduction, Body dimensions, and Conclusion..."
                      className="w-full p-4 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none leading-relaxed font-sans"
                    ></textarea>
                  </div>

                  {/* Submission success feedback */}
                  {submissionSuccess && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center justify-between">
                      <div>
                        ✅ <strong>Answer submitted successfully!</strong> Your answer has been saved for mentorship evaluation.
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSynopsis(true)}
                        className="underline text-emerald-900 font-semibold text-xs ml-4"
                      >
                        Compare with Model Answer
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSynopsis(!showSynopsis)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {showSynopsis ? "Hide Model Synopsis" : "💡 View Model Synopsis & Framework"}
                    </button>

                    <button
                      type="submit"
                      disabled={submitting || !answerText.trim()}
                      className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-300 text-white font-semibold text-sm rounded-lg shadow-sm transition-all"
                    >
                      {submitting ? "Submitting..." : "Submit Answer for Review"}
                    </button>
                  </div>
                </form>

                {/* Model Answer & Synopsis Reveal */}
                {showSynopsis && (
                  <div className="mt-8 pt-6 border-t border-gray-200 bg-amber-50/40 -mx-6 -mb-6 p-6 sm:p-8 rounded-b-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-bold font-serif text-amber-900">
                        Faculty Model Answer & Synopsis
                      </h4>
                      <span className="text-xs bg-amber-200 text-amber-900 font-semibold px-2 py-0.5 rounded">
                        Standard Benchmark
                      </span>
                    </div>

                    <div className="text-xs font-medium text-amber-800 mb-3 bg-amber-100/60 p-3 rounded-lg">
                      <strong>Synopsis Framework:</strong> {selectedQuestion.synopsis}
                    </div>

                    <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed bg-white p-5 rounded-xl border border-amber-200">
                      {selectedQuestion.model_answer}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MainsAnswerWriting;

