import React, { useState } from "react";

const StudyMaterials = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const materials = [
    {
      id: 1,
      category: "syllabus",
      title: "UPSC CSE Official Detailed Syllabus (Prelims + Mains)",
      type: "PDF Resource",
      size: "2.4 MB",
      description: "Micro-topic breakdown of GS Papers I, II, III, IV, Essay and CSAT with keyword mapping.",
    },
    {
      id: 2,
      category: "ncert",
      title: "Consolidated NCERT Gist: History (Class 6-12)",
      type: "Compilation",
      size: "8.1 MB",
      description: "Ancient, Medieval, and Modern Indian history summarized for quick revision.",
    },
    {
      id: 3,
      category: "ncert",
      title: "Consolidated NCERT Gist: Geography (Class 11-12)",
      type: "Compilation",
      size: "9.5 MB",
      description: "Physical Geography, Indian Geography, Climatology, and Oceanography fundamentals.",
    },
    {
      id: 4,
      category: "pyq",
      title: "Last 10 Years UPSC Prelims Solved Papers (2014-2024)",
      type: "PYQ Bank",
      size: "14.2 MB",
      description: "Topic-wise sorted questions with official UPSC answer keys and detailed explanations.",
    },
    {
      id: 5,
      category: "mains_notes",
      title: "GS Paper II: Constitutional Provisions & Governance Mindmaps",
      type: "Revision Notes",
      size: "5.8 MB",
      description: "Articles, Supreme Court landmark cases, and Law Commission recommendations.",
    },
    {
      id: 6,
      category: "mains_notes",
      title: "GS Paper III: Economic Survey & Budget Key Highlights",
      type: "Summary",
      size: "4.1 MB",
      description: "Sectoral growth tables, fiscal metrics, and flagship schemes for mains value-addition.",
    },
  ];

  const filtered =
    activeCategory === "all"
      ? materials
      : materials.filter((m) => m.category === activeCategory);

  const handleDownload = (item) => {
    setDownloadSuccess(item.title);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Knowledge Repository
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-3">
            UPSC Study Materials & Reference Notes
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Curated NCERT summaries, previous year question banks, and syllabus mindmaps compiled by faculty and toppers.
          </p>
        </div>

        {/* Download notification */}
        {downloadSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-sm font-medium">
            📥 Initiated download for <strong>{downloadSuccess}</strong>.
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: "all", label: "All Resources" },
            { id: "syllabus", label: "Official Syllabus" },
            { id: "ncert", label: "NCERT Compilations" },
            { id: "pyq", label: "Previous Year Papers" },
            { id: "mains_notes", label: "GS Value-Addition Notes" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeCategory === tab.id
                  ? "bg-amber-700 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-amber-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                  <span className="text-gray-400 font-mono">{item.size}</span>
                </div>
                <h3 className="font-bold text-slate-900 font-serif text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">Free PDF Access</span>
                <button
                  onClick={() => handleDownload(item)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>⬇</span> Download
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StudyMaterials;

