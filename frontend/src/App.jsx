import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import CurrentAffairs from "./pages/CurrentAffairs";
import PrelimsQuiz from "./pages/PrelimsQuiz";
import MainsAnswerWriting from "./pages/MainsAnswerWriting";
import Courses from "./pages/Courses";
import StudyMaterials from "./pages/StudyMaterials";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-slate-800">
      {/* Top Notification / Alerts Header */}
      <Header />

      {/* Main Navigation Bar */}
      <Navbar />

      {/* Primary Content View */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/current-affairs" element={<CurrentAffairs />} />
          <Route path="/prelims-quiz" element={<PrelimsQuiz />} />
          <Route path="/mains-answer-writing" element={<MainsAnswerWriting />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/study-materials" element={<StudyMaterials />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Aspirant Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

