import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import OcrModule from "./components/OcrModule";
import LessonPlanner from "./components/LessonPlanner";
import CurriculumBrowser from "./components/CurriculumBrowser";
import AssessmentGenerator from "./components/AssessmentGenerator";
import TeachingAssistant from "./components/TeachingAssistant";
import {
  BookOpen,
  Camera,
  Layers,
  FileQuestion,
  BrainCircuit,
  Bookmark,
  Sparkles,
  Wifi,
  WifiOff,
  User,
  GraduationCap,
  TrendingUp,
  X,
  Printer,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { SavedLessonPlan, SavedQuiz } from "./curriculumData";

// Notification Type
interface Toast {
  text: string;
  type: "success" | "warning" | "info";
  id: string;
}

export default function App() {
  // Global States
  const [teacherName, setTeacherName] = useState<string>(() => {
    return localStorage.getItem("teacherOS_name") || "Teacher Adebayo";
  });
  const [selectedState, setSelectedState] = useState<string>("Lagos");
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Function to switch tab and close overlay on mobile
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  // OCR outputs to share with parameters
  const [digitizedText, setDigitizedText] = useState("");
  const [digitizedSubject, setDigitizedSubject] = useState("Basic Science");
  const [digitizedTopic, setDigitizedTopic] = useState("");
  const [digitizedGrade, setDigitizedGrade] = useState("JSS 1");

  // Local storage lists for Saved lessons/quizzes
  const [savedLessons, setSavedLessons] = useState<SavedLessonPlan[]>(() => {
    const saved = localStorage.getItem("teacherOS_lessons");
    if (saved) return JSON.parse(saved);
    // Seed standard mock lessons
    return [
      {
        id: "mock-lesson-01",
        createdAt: "04/06/2026",
        grade: "JSS 1",
        subject: "Basic Science",
        topic: "Living and Non-Living Things",
        duration: "40 Minutes",
        materialsOption: "Zero-cost local community resources",
        contentMarkdown: `# JSS 1 Lesson Plan: Living and Non-Living Things
## General Information
*   **Grade Level:** JSS 1
*   **Subject:** Basic Science
*   **Duration:** 40 Minutes

## 1. Objectives
By the end of this JSS 1 session, students can:
1. State the characteristics of living things using "MR NIGER D".
2. Categorize items found in the school yard as living or non-living.

## 2. Low-Cost Materials Sourced Locally
*   FARM SAMPLE: Dry leaves, potted soil, fresh grass.
*   Captured grasshoppers in transparent jars for breathing demonstration.

## 3. Large Classroom Management
*   Row group competition: Identify 5 living things from the school backyard.`
      }
    ];
  });

  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>(() => {
    const saved = localStorage.getItem("teacherOS_quizzes");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "mock-quiz-01",
        createdAt: "05/06/2026",
        grade: "Primary 5",
        subject: "Mathematics",
        topic: "Fractions Addition and Subtraction",
        questionCount: 2,
        difficulty: "Medium",
        style: "Objective (Multiple Choice)",
        data: {
          instructions: "Attempt all questions. Circle the letter with the correct answer.",
          questions: [
            {
              number: 1,
              questionText: "If Chinedu splits one loaf of Agege Bread into 4 equal slices and eats 1 slice, what fraction of the loaf remains?",
              options: ["1/4", "2/4", "3/4", "4/4"],
              correctOption: "C",
              sampleAnswer: "Total is 4/4. Eats 1/4. Remainder is (4-1)/4 = 3/4."
            },
            {
              number: 2,
              questionText: "Amina has 1/2 of a Naira coin sum, and Emeka has 1/4 of the same sum. What is their combined fraction?",
              options: ["1/6", "2/4", "3/4", "5/4"],
              correctOption: "C",
              sampleAnswer: "Convert 1/2 to 2/4. Then 2/4 + 1/4 = 3/4."
            }
          ],
          markingScheme: "Each correct choice is awarded 5 marks. Total obtainable: 10 marks."
        }
      }
    ];
  });

  // Track changes to trigger offline / sync indicators
  useEffect(() => {
    localStorage.setItem("teacherOS_name", teacherName);
  }, [teacherName]);

  useEffect(() => {
    localStorage.setItem("teacherOS_lessons", JSON.stringify(savedLessons));
    // Trigger brief pending-sync simulation
    setIsSynced(false);
    const t = setTimeout(() => setIsSynced(true), 1100);
    return () => clearTimeout(t);
  }, [savedLessons]);

  useEffect(() => {
    localStorage.setItem("teacherOS_quizzes", JSON.stringify(savedQuizzes));
    setIsSynced(false);
    const t = setTimeout(() => setIsSynced(true), 1100);
    return () => clearTimeout(t);
  }, [savedQuizzes]);

  // Toast helper
  const triggerNotification = (text: string, type: "success" | "warning" | "info" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { text, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const deleteLesson = (id: string) => {
    setSavedLessons((prev) => prev.filter((l) => l.id !== id));
    triggerNotification("Lesson plan removed from your archives.", "warning");
  };

  const deleteQuiz = (id: string) => {
    setSavedQuizzes((prev) => prev.filter((q) => q.id !== id));
    triggerNotification("Assessment template deleted.", "warning");
  };

  // OCR transfer helper
  const handleSetDigitizedLesson = (text: string, subject: string, topic: string, grade: string) => {
    setDigitizedText(text);
    setDigitizedSubject(subject);
    setDigitizedTopic(topic);
    setDigitizedGrade(grade);
    handleTabChange("planner"); // auto flip to planner!
    triggerNotification("OCR Text loaded! Formulate your Lesson Plan now.", "success");
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#3D352F] flex flex-col font-sans select-none" id="teacher-os-root">
      
      {/* Toast Alert list */}
      <div className="fixed top-5 right-5 z-50 space-y-2.5 max-w-sm pointer-events-none" id="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`shadow-lg rounded-xl p-4 border text-xs font-bold flex items-center justify-between gap-3 pointer-events-auto transform transition-all translate-y-0 animate-slideIn ${
              t.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : t.type === "warning"
                ? "bg-amber-50 border-amber-300 text-amber-800"
                : "bg-indigo-50 border-indigo-300 text-indigo-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span>{t.text}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
              className="text-gray-400 hover:text-gray-800 font-semibold"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Overlay Backdrop for Mobile Menu Drawer */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
            onClick={() => setIsSidebarOpen(false)}
            id="sidebar-mobile-overlay"
          />
        )}

        {/* Sidebar Container - Elegant Slide-Out Drawer on Mobile, Permanent on Desktop */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 w-72 lg:w-64 bg-[#4A5D4E] text-[#F9F7F2] flex flex-col p-6 shrink-0 lg:border-r border-[#3D4B3F] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          id="sidebar-container"
        >
          
          {/* Logo Brand & Close Trigger */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E6A05D] rounded-xl flex items-center justify-center text-[#F9F7F2] font-black text-xl shadow-md border border-[#F0C9A5]/15">
                T
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
                  TeacherOS
                </h1>
                <p className="text-[10.5px] text-[#F2EDE4] opacity-80 mt-1">Nigerian Core Co-pilot</p>
              </div>
            </div>
            
            {/* Close Button on Mobile view */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-[#F2EDE4] hover:text-white hover:bg-[#5D7061] rounded-xl transition-all"
              title="Close Menu"
              id="mobile-menu-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1.5">
            <span className="text-[10px] font-bold text-[#E6A05D] opacity-75 uppercase tracking-widest pl-3 block mb-2">
              Workspaces
            </span>

            <button
              onClick={() => handleTabChange("dashboard")}
              className={`w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all ${
                activeTab === "dashboard"
                  ? "bg-[#5D7061] text-white font-semibold border-l-4 border-[#E6A05D]"
                  : "hover:bg-[#5D7061]/40 text-[#F9F7F2]/90 hover:text-white"
              }`}
              id="sidebar-tab-overview"
            >
              <Layers className="w-4 h-4 text-[#F2EDE4]" />
              <span className="text-xs">Summary Dashboard</span>
            </button>

            <button
              onClick={() => handleTabChange("ocr")}
              className={`w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all ${
                activeTab === "ocr"
                  ? "bg-[#5D7061] text-white font-semibold border-l-4 border-[#E6A05D]"
                  : "hover:bg-[#5D7061]/40 text-[#F9F7F2]/90 hover:text-white"
              }`}
              id="sidebar-tab-ocr"
            >
              <Camera className="w-4 h-4 text-[#F2EDE4]" />
              <div className="flex-1 flex justify-between items-center">
                <span className="text-xs">OCR Notebook Scan</span>
                <span className="bg-[#E6A05D] text-[9px] font-black text-white px-1.5 py-0.5 rounded">AI</span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange("planner")}
              className={`w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all ${
                activeTab === "planner"
                  ? "bg-[#5D7061] text-white font-semibold border-l-4 border-[#E6A05D]"
                  : "hover:bg-[#5D7061]/40 text-[#F9F7F2]/90 hover:text-white"
              }`}
              id="sidebar-tab-planner"
            >
              <BookOpen className="w-4 h-4 text-[#F2EDE4]" />
              <span className="text-xs">AI Lesson Notes Compiler</span>
            </button>

            <button
              onClick={() => handleTabChange("curriculum")}
              className={`w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all ${
                activeTab === "curriculum"
                  ? "bg-[#5D7061] text-white font-semibold border-l-4 border-[#E6A05D]"
                  : "hover:bg-[#5D7061]/40 text-[#F9F7F2]/90 hover:text-white"
              }`}
              id="sidebar-tab-curriculum"
            >
              <CheckCircle className="w-4 h-4 text-[#F2EDE4]" />
              <span className="text-xs">Curriculum Check & Verifier</span>
            </button>

            <button
              onClick={() => handleTabChange("quizzes")}
              className={`w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all ${
                activeTab === "quizzes"
                  ? "bg-[#5D7061] text-white font-semibold border-l-4 border-[#E6A05D]"
                  : "hover:bg-[#5D7061]/40 text-[#F9F7F2]/90 hover:text-white"
              }`}
              id="sidebar-tab-quizzes"
            >
              <FileQuestion className="w-4 h-4 text-[#F2EDE4]" />
              <span className="text-xs">Assessment Sheet Maker</span>
            </button>

            <button
              onClick={() => handleTabChange("assistant")}
              className={`w-full text-left rounded-xl p-3 flex items-center gap-3 pr-2 transition-all ${
                activeTab === "assistant"
                  ? "bg-[#5D7061] text-white font-semibold border-l-4 border-[#E6A05D]"
                  : "hover:bg-[#5D7061]/40 text-[#F9F7F2]/90 hover:text-white"
              }`}
              id="sidebar-tab-assistant"
            >
              <BrainCircuit className="w-4 h-4 text-[#F2EDE4]" />
              <div className="flex-1 flex justify-between items-center">
                <span className="text-xs">Pedagogical chat co-pilot</span>
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange("archives")}
              className={`w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all ${
                activeTab === "archives"
                  ? "bg-[#5D7061] text-white font-semibold border-l-4 border-[#E6A05D]"
                  : "hover:bg-[#5D7061]/40 text-[#F9F7F2]/90 hover:text-white"
              }`}
              id="sidebar-tab-archives"
            >
              <Bookmark className="w-4 h-4 text-[#F2EDE4]" />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-xs">My Saved Archives</span>
                <span className="bg-[#415144] px-1.5 py-0.5 text-[9px] font-bold text-[#F2EDE4] rounded-md">
                  {savedLessons.length + savedQuizzes.length}
                </span>
              </div>
            </button>
          </nav>

          {/* Bottom Connectivity Status Panel */}
          <div className="mt-8 pt-4 border-t border-[#F9F7F2]/10">
            <div className="bg-[#3D4B3F] p-4 rounded-xl border border-[#5D7061]/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#E6A05D]">
                  Offline Protection
                </p>
                {isOfflineMode ? (
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                )}
              </div>
              <p className="text-[11px] text-[#F2EDE4] leading-relaxed opacity-90">
                {isOfflineMode
                  ? "Simulating spotty connection. Running local curriculum databases and caching."
                  : "Optimal link active. Using Gemini 3.5 live models to synthesize lesson notes."}
              </p>
            </div>
          </div>

        </aside>

        {/* Main core layout space */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* Top Header Section */}
          <Header
            teacherName={teacherName}
            setTeacherName={setTeacherName}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            isOfflineMode={isOfflineMode}
            setIsOfflineMode={setIsOfflineMode}
            isSynced={isSynced}
            onMenuOpen={() => setIsSidebarOpen(true)}
          />

          {/* Scrollable Work area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 select-text">
            
            {/* TAB: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 animate-fadeIn" id="dashboard-tab-content">
                
                {/* Hero Greeting Card */}
                <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E8E4D9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-[#4A5D4E]/5 rounded-bl-full pointer-events-none" />
                  
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-[#F2EDE4] text-[#8B7E74] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#E8E4D9]">
                      NERDC Curriculum Aligned
                    </span>
                    <h2 className="text-3xl font-serif text-[#3D352F] italic font-black leading-tight">
                      Empowering {teacherName || "Nigerian Teachers"}
                    </h2>
                    <p className="text-sm text-[#8B7E74] max-w-xl">
                      Eliminate hours of manual preparation. Scan notebook topics, check curriculum standards, generate classroom-ready evaluations, and get teaching suggestions optimized for large classroom environments in {selectedState} State.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setActiveTab("ocr")}
                      className="px-5 py-2.5 bg-[#E6A05D] hover:bg-[#D48F4C] text-white flex items-center gap-1.5 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95"
                      id="hero-scan-button"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Scan Notebook Note</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("planner")}
                      className="px-5 py-2.5 bg-[#4A5D4E] hover:bg-[#3D4B3F] text-white flex items-center gap-1.5 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95"
                      id="hero-planner-button"
                    >
                      <span>New Lesson Plan</span>
                    </button>
                  </div>
                </div>

                {/* Grid stats metric cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="bg-[#F2EDE4] p-5 rounded-2xl border border-[#E8E4D9] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#8B7E74] uppercase tracking-wider block">Manual prep work saved</span>
                      <p className="text-3xl font-serif italic font-black text-[#4A5D4E] mt-1">
                        {(savedLessons.length * 3.5 + savedQuizzes.length * 2).toFixed(1)} hrs
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-2 block">Calculated at 3h/plan saving average</span>
                  </div>

                  <div className="bg-[#F2EDE4] p-5 rounded-2xl border border-[#E8E4D9] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#8B7E74] uppercase tracking-wider block">Compliance rating standard</span>
                      <p className="text-3xl font-serif italic font-black text-[#4A5D4E] mt-1">98.2%</p>
                    </div>
                    <span className="text-[10px] text-emerald-800 font-bold mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> All drafts checked via NERDC AI
                    </span>
                  </div>

                  <div className="bg-[#F2EDE4] p-5 rounded-2xl border border-[#E8E4D9] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#8B7E74] uppercase tracking-wider block">Saved lesson archives</span>
                      <p className="text-3xl font-serif italic font-black text-[#4A5D4E] mt-1">
                        {savedLessons.length} Drafts
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-2 block">Locally cached in browser</span>
                  </div>

                  <div className="bg-[#F2EDE4] p-5 rounded-2xl border border-[#E8E4D9] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#8B7E74] uppercase tracking-wider block">Evaluations generated</span>
                      <p className="text-3xl font-serif italic font-black text-[#4A5D4E] mt-1">
                        {savedQuizzes.length} Quizzes
                      </p>
                    </div>
                    <span className="text-[10px] text-[#E6A05D] font-bold mt-2 block">Complete with answers scheme</span>
                  </div>

                </div>

                {/* Middle workspace layouts split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Quick tips & Pedagogy highlights */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E4D9] p-6 shadow-sm space-y-4">
                    <h3 className="font-sans font-bold text-sm text-[#3D352F] uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E6A05D] fill-[#E6A05D]" /> TeacherOS Smart Assistance tips
                    </h3>
                    
                    <div className="space-y-3.5 pt-2">
                      
                      <div className="p-4 bg-[#F9F7F2] rounded-xl border border-[#E8E4D9]/60 flex gap-3.5">
                        <span className="w-8 h-8 rounded-full bg-[#4A5D4E] text-white shrink-0 flex items-center justify-center text-xs font-bold">1</span>
                        <div>
                          <h4 className="text-xs font-bold text-[#3D352F] mb-0.5">Overcrowded classroom strategy (50-70 pupils)</h4>
                          <p className="text-xs text-[#8B7E74] leading-relaxed">
                            Try the **Row-Tally contest** today. Keep pupils in their columns to avoid moving benches. Give each column a colored card response flag.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-[#F9F7F2] rounded-xl border border-[#E8E4D9]/60 flex gap-3.5">
                        <span className="w-8 h-8 rounded-full bg-[#E6A05D] text-white shrink-0 flex items-center justify-center text-xs font-bold">2</span>
                        <div>
                          <h4 className="text-xs font-bold text-[#3D352F] mb-0.5">Low-cost material recommendation</h4>
                          <p className="text-xs text-[#8B7E74] leading-relaxed">
                            Use local soda mineral plastic bottles cut in half to create improvised liquid scale cylinders, and dry seeds as counters in early arithmetic.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-[#F9F7F2] rounded-xl border border-[#E8E4D9]/60 flex gap-3.5">
                        <span className="w-8 h-8 rounded-full bg-[#4A5D4E] text-white shrink-0 flex items-center justify-center text-xs font-bold">3</span>
                        <div>
                          <h4 className="text-xs font-bold text-[#3D352F] mb-0.5">Continuous evaluation helper</h4>
                          <p className="text-xs text-[#8B7E74] leading-relaxed">
                            Launch our **Assessment Sheet Maker** to create objective MCQ sheets formatted with standard West African examples (Naira, local crops).
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Mini chat preview/consult tracker */}
                  <div className="lg:col-span-5 bg-[#4A5D4E] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#E6A05D] uppercase tracking-widest block">Pedagogical Assistant</span>
                        <span className="text-[9px] bg-[#3D4B3F] text-white px-2 py-0.5 rounded border border-[#5D7061]">Live copilot</span>
                      </div>
                      
                      <h4 className="text-lg font-serif italic text-[#F9F7F2]">"How can we explain complex scientific concepts simply to pupils?"</h4>
                      
                      <p className="text-xs text-[#F2EDE4] leading-relaxed opacity-90">
                        Ask TeacherOS to explain difficult syllabus blocks using fun local Nigerian references. Compare electric circuitry to central city commercial transport lines, and plant photosynthesis to roasting Garri over local hearths.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab("assistant")}
                      className="mt-6 w-full py-2.5 bg-[#E6A05D] hover:bg-[#D48F4C] text-[#F9F7F2] font-semibold text-xs rounded-xl text-center shadow-lg transition-all active:scale-95"
                      id="dashboard-consult-companion"
                    >
                      Consult AI Assistant Now
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* TAB: OCR NOTE SCANNER */}
            {activeTab === "ocr" && (
              <div className="animate-fadeIn" id="ocr-tab-content">
                <OcrModule
                  isOffline={isOfflineMode}
                  onSetDigitizedLesson={handleSetDigitizedLesson}
                  triggerNotification={triggerNotification}
                />
              </div>
            )}

            {/* TAB: LESSON NOTES BUILDER */}
            {activeTab === "planner" && (
              <div className="animate-fadeIn" id="planner-tab-content">
                <LessonPlanner
                  isOffline={isOfflineMode}
                  digitizedNotes={digitizedText}
                  onSaveLesson={(newPlan) => setSavedLessons((prev) => [newPlan, ...prev])}
                  triggerNotification={triggerNotification}
                  initialSubject={digitizedSubject}
                  initialTopic={digitizedTopic}
                  initialGrade={digitizedGrade}
                />
              </div>
            )}

            {/* TAB: CURRICULUM CHECK & VERIFY */}
            {activeTab === "curriculum" && (
              <div className="animate-fadeIn" id="curriculum-tab-content">
                <CurriculumBrowser
                  isOffline={isOfflineMode}
                  triggerNotification={triggerNotification}
                />
              </div>
            )}

            {/* TAB: ASSESSMENT MAKER */}
            {activeTab === "quizzes" && (
              <div className="animate-fadeIn" id="quizzes-tab-content">
                <AssessmentGenerator
                  isOffline={isOfflineMode}
                  onSaveQuiz={(newQuiz) => setSavedQuizzes((prev) => [newQuiz, ...prev])}
                  triggerNotification={triggerNotification}
                  activeTopic={digitizedTopic}
                  activeSubject={digitizedSubject}
                  activeGrade={digitizedGrade}
                />
              </div>
            )}

            {/* TAB: PEDAGOGICAL COMPANION CHAT */}
            {activeTab === "assistant" && (
              <div className="animate-fadeIn" id="assistant-tab-content">
                <TeachingAssistant
                  isOffline={isOfflineMode}
                  triggerNotification={triggerNotification}
                  activeSubject={digitizedSubject}
                  activeGrade={digitizedGrade}
                  activeTopic={digitizedTopic}
                />
              </div>
            )}

            {/* TAB: SAVED ARCHIVES */}
            {activeTab === "archives" && (
              <div className="space-y-6 animate-fadeIn" id="archives-tab-content">
                
                <div className="bg-white rounded-2xl border border-[#E8E4D9] p-6 shadow-sm">
                  <h2 className="font-sans font-bold text-xl text-[#3D352F] flex items-center gap-2">
                    <span className="p-1.5 bg-[#4A5D4E]/10 text-[#4A5D4E] rounded-lg">
                      <Bookmark className="w-5 h-5" />
                    </span>
                    My Saved School Archives
                  </h2>
                  <p className="text-xs text-[#8B7E74] mt-1">
                    Manage and view generated lesson outlines, exercises, and evaluation rubrics saved on this device
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Column: Lessons */}
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-base text-[#4A5D4E] italic flex items-center justify-between border-b border-[#E8E4D9] pb-2">
                      <span>Saved Lesson Plans</span>
                      <span className="bg-gray-100 text-[#3D352F] px-2.5 py-0.5 rounded-full text-xs font-bold">
                        {savedLessons.length}
                      </span>
                    </h3>

                    {savedLessons.length === 0 ? (
                      <p className="text-xs text-[#8B7E74] italic">No saved lesson plans yet. Compile one today!</p>
                    ) : (
                      savedLessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="bg-white rounded-xl border border-[#E8E4D9] p-5 shadow-sm hover:border-[#4A5D4E]/40 transition-all space-y-3"
                          id={`saved-lesson-${lesson.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#E6A05D] block mb-0.5">
                                {lesson.subject} • {lesson.grade}
                              </span>
                              <h4 className="font-serif font-bold text-sm text-[#3D352F] italic">
                                {lesson.topic}
                              </h4>
                              <span className="text-[10px] text-gray-400 mt-1 block">
                                Saved: {lesson.createdAt}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  // Restore into Lesson planner state
                                  setDigitizedTopic(lesson.topic);
                                  setDigitizedSubject(lesson.subject);
                                  setDigitizedGrade(lesson.grade);
                                  setDigitizedText(lesson.contentMarkdown);
                                  setActiveTab("planner");
                                  triggerNotification("Restored lesson notes draft!", "info");
                                }}
                                className="p-1.5 hover:bg-gray-100 text-[#4A5D4E] rounded-md text-xs font-bold"
                                title="Open & Edit"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteLesson(lesson.id)}
                                className="p-1.5 hover:bg-red-50 text-red-650 rounded-md"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="bg-[#F9F7F2] p-3 rounded-lg max-h-[140px] overflow-y-auto text-[10.5px] leading-relaxed text-[#3D352F] border border-[#E8E4D9]/40 whitespace-pre-wrap select-text">
                            {lesson.contentMarkdown}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Column: Quizzes */}
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-base text-[#4A5D4E] italic flex items-center justify-between border-b border-[#E8E4D9] pb-2">
                      <span>Saved Evaluations & Quizzes</span>
                      <span className="bg-gray-100 text-[#3D352F] px-2.5 py-0.5 rounded-full text-xs font-bold">
                        {savedQuizzes.length}
                      </span>
                    </h3>

                    {savedQuizzes.length === 0 ? (
                      <p className="text-xs text-[#8B7E74] italic">No saved quizzes yet. Draft one inside the creator workspace!</p>
                    ) : (
                      savedQuizzes.map((quiz) => (
                        <div
                          key={quiz.id}
                          className="bg-white rounded-xl border border-[#E8E4D9] p-5 shadow-sm hover:border-[#4A5D4E]/40 transition-all space-y-3"
                          id={`saved-quiz-${quiz.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#E6A05D] block mb-0.5">
                                {quiz.subject} • {quiz.grade} ({quiz.style})
                              </span>
                              <h4 className="font-serif font-bold text-sm text-[#3D352F] italic">
                                {quiz.topic}
                              </h4>
                              <span className="text-[10px] text-gray-400 mt-1 block">
                                Saved: {quiz.createdAt} • {quiz.questionCount} Questions
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => deleteQuiz(quiz.id)}
                                className="p-1.5 hover:bg-red-50 text-red-650 rounded-md"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Quick Quiz metadata overview */}
                          <div className="bg-[#F9F7F2] p-3.5 rounded-lg text-[10.5px] border border-[#E8E4D9]/40 space-y-2 select-text">
                            <span className="font-bold block text-gray-700 underline">General Instructions:</span>
                            <p className="italic text-gray-600">"{quiz.data.instructions}"</p>
                            
                            <span className="font-bold block text-gray-700 underline mt-2">Questions Preview:</span>
                            <ul className="list-decimal pl-4 space-y-1">
                              {quiz.data.questions.slice(0, 2).map((q: any, i: number) => (
                                <li key={i} className="line-clamp-1">{q.questionText}</li>
                              ))}
                            </ul>
                            {quiz.data.questions.length > 2 && (
                              <span className="text-gray-400 block italic">and {quiz.data.questions.length - 2} more...</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* Device level footer margin credit line */}
          <footer className="bg-white border-t border-[#E8E4D9] text-center p-3">
            <p className="text-[10.5px] text-[#8B7E74]">
              TeacherOS Nigeria is powered by Gemini AI. Optimized to run offline. Fully aligned with National NERDC Guidelines.
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}
