import React, { useState, useEffect } from "react";
import api from "../services/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourse, setEnrolledCourse] = useState(null);

  const defaultCourses = [
    {
      id: 1,
      title: "Sankalp Comprehensive GS Foundation 2026-27",
      subtitle: "Integrated Prelims-cum-Mains Guidance Program",
      level: "Beginner to Advanced",
      duration: "12 Months",
      faculty: "Ex-Civil Servants & Senior Domain Faculty",
      price: "₹ 48,000",
      description: "A complete syllabus coverage program designed for UPSC CSE aspirants targeting 2026 and 2027. Covers GS Papers I to IV, Essay, Weekly Mock Tests, Personal Mentorship, and Daily Current Affairs mapping.",
      features: [
        "800+ Hours of Live & Recorded Classes",
        "Comprehensive Study Material & Hardcopy Modules",
        "Prelims Test Series (35 Tests with Detailed Explanations)",
        "Mains Answer Writing Evaluation by Mentors",
        "Dedicated Weekly 1-on-1 Strategy Calls",
      ],
    },
    {
      id: 2,
      title: "Mains Answer Writing & Evaluation Mentorship",
      subtitle: "Transform Content into High-Scoring Mains Answers",
      level: "Mains Oriented",
      duration: "6 Months",
      faculty: "Sankalp Core Mains Evaluation Board",
      price: "₹ 18,500",
      description: "Focus on answer structuring, introduction hook frameworks, diagram insertion, case studies, and time-bound drafting. Includes individual faculty feedback within 48 hours.",
      features: [
        "120 GS Questions with Model Synopses",
        "Ethics Case Study Mastery Workshop",
        "Essay Brainstorming Frameworks",
        "48-Hour Turnaround Evaluation with Line-by-line Feedback",
      ],
    },
    {
      id: 3,
      title: "Prelims High-Yield Test Series & CSAT Engine",
      subtitle: "Statement-Based Simulation & Elimination Techniques",
      level: "Prelims Intensive",
      duration: "4 Months",
      faculty: "Prelims Research Group",
      price: "₹ 9,500",
      description: "Engineered specifically to counter UPSC CSE Prelims pattern shifts with multi-statement questions, negative marking optimization, and CSAT Paper II confidence booster.",
      features: [
        "40 Sectional and Full-Length Tests",
        "AI-Powered Weak Area Diagnostics",
        "CSAT Comprehension & Quant Crash Course",
        "Detailed Performance Analytics & Rank Prediction",
      ],
    },
    {
      id: 4,
      title: "Ethics (GS IV) & Essay Masterclass",
      subtitle: "Score 250+ in the Two Decisive Papers",
      level: "Targeted Module",
      duration: "2 Months",
      faculty: "Senior Ethics & Philosophy Mentors",
      price: "₹ 12,000",
      description: "Comprehensive coverage of Western and Indian moral philosophers, real-life administrative case studies, emotional intelligence, and philosophical essay writing techniques.",
      features: [
        "50+ Administrative Case Studies Solved",
        "Philosopher & Thinker Quotes Compendium",
        "10 Essay Full Length Evaluations",
        "Personalized Tone and Flow Rectification",
      ],
    },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        if (response.data?.data && response.data.data.length > 0) {
          setCourses(response.data.data);
        } else {
          setCourses(defaultCourses);
        }
      } catch {
        setCourses(defaultCourses);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = (course) => {
    setEnrolledCourse(course.title);
    setTimeout(() => {
      setEnrolledCourse(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Targeted UPSC Courses
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-3">
            Structured Mentorship Programs
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Handcrafted classroom and mentorship batches designed to guide civil service aspirants from basics to interview stage.
          </p>
        </div>

        {/* Enrollment Toast */}
        {enrolledCourse && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-sm font-medium">
            🎉 Enrollment inquiry submitted for <strong>{enrolledCourse}</strong>! Our academic counselor will reach out shortly.
          </div>
        )}

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {course.level}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Duration: {course.duration}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-serif text-slate-900">
                  {course.title}
                </h3>
                <p className="text-xs text-amber-700 font-semibold mt-1">
                  {course.subtitle}
                </p>

                <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                  {course.description}
                </p>

                {course.features && (
                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Key Highlights:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4">
                      {course.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Tuition Fee</span>
                  <span className="text-xl font-bold text-slate-900">{course.price}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    View Syllabus
                  </button>
                  <button
                    onClick={() => handleEnroll(course)}
                    className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Details Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  {selectedCourse.level} • {selectedCourse.duration}
                </span>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>

              <h3 className="text-xl font-bold font-serif text-slate-900">
                {selectedCourse.title}
              </h3>
              <p className="text-xs text-amber-700 font-medium mt-1">
                Faculty: {selectedCourse.faculty}
              </p>

              <div className="mt-4 text-sm text-gray-600 leading-relaxed">
                {selectedCourse.description}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Curriculum Breakdown:
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Phase 1: NCERT Fundamentals & Concept Clarity</p>
                  <p>• Phase 2: Standard Reference Works (Polity, History, Economy)</p>
                  <p>• Phase 3: Contemporary Current Affairs & Scheme Integration</p>
                  <p>• Phase 4: Mains Answer Structuring & High-Scoring Techniques</p>
                  <p>• Phase 5: Prelims Intensive MCQ Drilling & Test Series</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEnroll(selectedCourse);
                    setSelectedCourse(null);
                  }}
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold"
                >
                  Enroll in Program
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Courses;

