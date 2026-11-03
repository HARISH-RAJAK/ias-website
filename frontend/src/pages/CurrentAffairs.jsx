import React, { useState, useEffect } from "react";
import api from "../services/api";

/**
 * =======================================================================
 * STITCH DESIGN PLACEHOLDER: 2. Daily Current Affairs & Editorial Analysis
 * FILE PATH: frontend/src/pages/CurrentAffairs.jsx
 * 
 * INSTRUCTIONS:
 * When you provide your Google Stitch code for the Current Affairs screen,
 * paste your Stitch JSX inside the designated STITCH CONTAINER below.
 * =======================================================================
 */

const CurrentAffairs = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [activeArticle, setActiveArticle] = useState(null);

  // Fallback seed articles for immediate UI preview
  const defaultArticles = [
    {
      id: 1,
      title: "India's Semiconductor Mission: Challenges and Strategic Opportunities",
      category: "GS Paper III – Economy & Tech",
      summary: "An analysis of the PLI schemes, geopolitical shifts in silicon supply chains, and domestic talent hurdles facing India's fab ecosystem.",
      content: `The India Semiconductor Mission (ISM) aims to establish a trusted and resilient electronics supply chain. While capital incentives have attracted global memory and assembly players, wafer fabrication still faces infrastructure constraints like uninterrupted power and ultrapure water supplies.\n\nKey Prelims Pointers:\n- Silicon Carbide and Gallium Nitride applications in EVs.\n- Micron's ATMP facility in Sanand, Gujarat.\n\nMains Practice Dimension:\n"Examine the strategic importance of semiconductor self-reliance for India's digital sovereignty and economic resilience."`,
      source: "The Hindu & PIB",
      tags: "Economy, Science & Technology, GS-3",
      published_date: "2026-11-03",
    },
    {
      id: 2,
      title: "Supreme Court Ruling on Federalism and Governor's Assent to Bills",
      category: "GS Paper II – Polity & Governance",
      summary: "Constitutional review of Article 200, federal friction between state governments and Raj Bhavans, and guidelines issued by the apex court.",
      content: `The Supreme Court reiterated that Governors must act expeditiously upon legislative bills passed by State Assemblies. Discretion under Article 200 cannot be exercised to indefinitely withhold assent or stall democratic processes.\n\nConstitutional Provisions:\n- Article 200: Assent to Bills by Governor.\n- Article 201: Bills reserved for consideration of the President.\n- Sarkaria and Punchhi Commission recommendations on gubernatorial roles.\n\nMains Relevance: Federal harmony, separation of powers, and state autonomy.`,
      source: "Indian Express",
      tags: "Polity, Constitution, Federalism, GS-2",
      published_date: "2026-11-03",
    },
    {
      id: 3,
      title: "Kunming-Montreal Global Biodiversity Framework: India's Progress",
      category: "GS Paper III – Environment & Ecology",
      summary: "Evaluation of the 30x30 conservation targets, community forest rights, and biodiversity management committees across Indian states.",
      content: `India has expanded its Ramsar wetland sites and tiger reserves, aligning with Target 3 of the Kunming-Montreal Global Biodiversity Framework. Focus is turning towards eco-sensitive zones and integrating indigenous communities into conservation.\n\nPrelims Crux:\n- Target 3: Protect 30% of degraded terrestrial and marine ecosystems by 2030.\n- Biodiversity Heritage Sites under the Biological Diversity Act, 2002.`,
      source: "Down to Earth",
      tags: "Environment, Ecology, Biodiversity, GS-3",
      published_date: "2026-11-02",
    },
    {
      id: 4,
      title: "India-Middle East-Europe Economic Corridor (IMEC): Strategic Value",
      category: "GS Paper II – International Relations",
      summary: "Geopolitical significance of multimodal trade connectivity connecting India, the Arabian Gulf, and European maritime routes.",
      content: `IMEC offers an alternative connectivity framework to counter supply route choke points like the Bab el-Mandeb and Suez Canal. Challenges remain regarding regional stability and railway interconnectivity.\n\nPillars of IMEC:\n- Eastern corridor connecting India to Arabian Gulf.\n- Northern corridor connecting Arabian Gulf to Europe.\n- Clean hydrogen pipelines and high-speed data cables.`,
      source: "LiveMint & Diplomat",
      tags: "International Relations, Geopolitics, GS-2",
      published_date: "2026-11-01",
    },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory);
        if (selectedDate) params.append("date", selectedDate);

        const response = await api.get(`/current-affairs?${params.toString()}`);
        if (response.data?.data && response.data.data.length > 0) {
          setArticles(response.data.data);
        } else {
          setArticles(defaultArticles);
        }
      } catch (err) {
        console.warn("Backend API unavailable, using offline fallback articles:", err);
        setArticles(defaultArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [searchTerm, selectedCategory, selectedDate]);

  // Client-side filtering when working with static fallback
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      article.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesDate = !selectedDate || article.published_date === selectedDate;
    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="current-affairs-page min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Daily Editorial & Current Affairs
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-2">
            Daily Current Affairs & Editorial Analysis
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            High-yield news analysis mapped directly to the UPSC Civil Services Syllabus (GS-1, 2, 3 & 4).
          </p>
        </div>

        {/* =======================================================================
            STITCH CONTAINER: Daily Current Affairs & Editorial Analysis
            Paste your Stitch-generated Current Affairs markup here.
            ======================================================================= */}
        
        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <input
                type="text"
                placeholder="Search articles, keywords (e.g. Semiconductor, Supreme Court)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              >
                <option value="all">All GS Papers</option>
                <option value="GS Paper I">GS Paper I (History & Geo)</option>
                <option value="GS Paper II">GS Paper II (Polity & IR)</option>
                <option value="GS Paper III">GS Paper III (Economy & Env)</option>
                <option value="GS Paper IV">GS Paper IV (Ethics)</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Articles Feed */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading current affairs analysis...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <p className="text-gray-500">No articles found matching your search or filter.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedDate("");
              }}
              className="mt-4 px-4 py-2 bg-amber-700 text-white rounded-lg text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">{article.published_date}</span>
                  </div>

                  <h2 className="text-lg font-bold font-serif text-slate-900 hover:text-amber-700 cursor-pointer transition-colors"
                      onClick={() => setActiveArticle(article)}>
                    {article.title}
                  </h2>

                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {article.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {article.tags?.split(",").map((tag, idx) => (
                      <span key={idx} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Source: {article.source}</span>
                  <button
                    onClick={() => setActiveArticle(article)}
                    className="font-semibold text-amber-700 hover:text-amber-800 inline-flex items-center"
                  >
                    Read Detailed Analysis →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Article Details Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900">
                  {activeArticle.category}
                </span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none p-1"
                >
                  &times;
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                {activeArticle.title}
              </h2>
              <div className="text-xs text-gray-500 mt-2 pb-4 border-b border-gray-200 flex items-center gap-4">
                <span>Published: {activeArticle.published_date}</span>
                <span>Source: {activeArticle.source}</span>
              </div>

              <div className="mt-6 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {activeArticle.content}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CurrentAffairs;

