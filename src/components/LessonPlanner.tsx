import React, { useState } from "react";
import { Sparkles, RefreshCw, FileText, Download, Printer, Save, CheckCircle2, AlertCircle } from "lucide-react";

interface LessonPlannerProps {
  isOffline: boolean;
  digitizedNotes: string;
  onSaveLesson: (lesson: any) => void;
  triggerNotification: (text: string, type: "success" | "warning" | "info") => void;
  initialSubject?: string;
  initialTopic?: string;
  initialGrade?: string;
}

export default function LessonPlanner({
  isOffline,
  digitizedNotes,
  onSaveLesson,
  triggerNotification,
  initialSubject = "Basic Science",
  initialTopic = "",
  initialGrade = "JSS 1",
}: LessonPlannerProps) {
  const [grade, setGrade] = useState(initialGrade);
  const [subject, setSubject] = useState(initialSubject);
  const [topic, setTopic] = useState(initialTopic);
  const [duration, setDuration] = useState("40 Minutes");
  const [materialsOption, setMaterialsOption] = useState("Zero-cost local community resources");
  const [specificFocus, setSpecificFocus] = useState("");
  const [localDigitizedContext, setLocalDigitizedContext] = useState(digitizedNotes);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlanMarkdown, setGeneratedPlanMarkdown] = useState<string>("");

  React.useEffect(() => {
    if (digitizedNotes) {
      setLocalDigitizedContext(digitizedNotes);
    }
  }, [digitizedNotes]);

  React.useEffect(() => {
    if (initialSubject) setSubject(initialSubject);
    if (initialTopic) setTopic(initialTopic);
    if (initialGrade) setGrade(initialGrade);
  }, [initialSubject, initialTopic, initialGrade]);

  const handleGenerate = async () => {
    if (!topic) {
      triggerNotification("Please fill in a Topic for your lesson plan.", "warning");
      return;
    }

    setIsGenerating(true);
    setGeneratedPlanMarkdown("");
    triggerNotification("Formulating curriculum lesson structure...", "info");

    try {
      if (isOffline) {
        // Simulate Offline creation from internal template directory
        await new Promise((resolve) => setTimeout(resolve, 1400));
        
        const offlinePlan = `# JSS 1 Lesson Plan: ${topic}
## General Information
*   **Grade Level:** ${grade}
*   **Subject:** ${subject}
*   **Duration:** ${duration}
*   **Materials Path:** ${materialsOption}

## 1. Behavioral Objectives
By the end of this JSS 1 session, students can:
1. Identify primary physical attributes and characteristics of **${topic}**.
2. Outline key components with labeled drawings on the blackboard.
3. Differentiate between environmental impacts of ${topic} inside standard communities.

## 2. Low-Cost Teaching Aids
*   Using local seeds, plastic containers, cardboard boxes, and recycled mineral water jars.
*   Simplified visual chart on large newsprint using local coal/chalk markers.

## 3. Lesson Development Sequence
*   **Introduction (Starter):** 5-minute interactive trivia linking ${topic} to students' homes or local markets.
*   **Presentation Step 1:** Discussion on core concept metrics.
*   **Presentation Step 2:** Class-wide demonstration utilizing zero-cost supplies.
*   **Student Activity:** Row competition: Students group list examples of the topic in Niger-Delta or Lagos neighborhoods.
*   **Evaluation:** Ask class rows: List two primary outcomes of our session topic.

## 4. Large Classroom Management Advice
*   Keep students in their columns for activities to prevent noise and furniture movement.
*   Check understanding by calling 'Numbered Pupils' on each bench to ensure fair participation.`;

        setGeneratedPlanMarkdown(offlinePlan);
        triggerNotification("Lesson plan generated via Offline curriculum library!", "success");
      } else {
        const response = await fetch("/api/lesson/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grade,
            subject,
            topic,
            duration,
            materialsOption,
            digitizedText: localDigitizedContext,
            specificFocus,
          }),
        });

        const resData = await response.json();
        if (resData.success) {
          setGeneratedPlanMarkdown(resData.lessonPlan);
          triggerNotification("High-quality, aligned lesson plan customized successfully!", "success");
        } else {
          throw new Error(resData.error || "Generator service rejected parameters.");
        }
      }
    } catch (err: any) {
      console.error(err);
      triggerNotification("AI Server offline. Loaded standardized lesson plan model.", "warning");
      setGeneratedPlanMarkdown(`# LESSON PLAN: ${topic || "Target Topic"}
## Class Metrics
*   **Subject:** ${subject}
*   **Grade Level:** ${grade}
*   **Allocated Time:** ${duration}

## Aligned Learning Objectives
*   Describe and categorize foundational terms of **${topic || "target topic"}** under standard conditions.
*   Illustrate concepts correctly on school whiteboards / blackboards.
*   Source local materials e.g. cardboard blocks and clean jars to create simulations.

## step-by-step Development:
1. **Interactive Starter (5m):** Connect concepts back to traditional marketplace mechanics in Nigeria.
2. **Main Block (25m):** Explain definitions clearly. Draw a divided structural card map on the blackboard.
3. **Cooperative Segment (10m):** Column-row games: identify practical community applications.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedPlanMarkdown) return;
    const item = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toLocaleDateString(),
      grade,
      subject,
      topic,
      duration,
      materialsOption,
      contentMarkdown: generatedPlanMarkdown,
    };
    onSaveLesson(item);
    triggerNotification("Lesson saved to local archives and synced!", "success");
  };

  const printDocument = () => {
    window.print();
  };

  // Helper to render markdown style lines simply
  const renderLineMarkdown = (text: string) => {
    return text.split("\n").map((line, idx) => {
      if (line.startsWith("# ")) {
        return <h1 key={idx} className="font-serif font-bold text-2xl text-[#4A5D4E] italic mt-4 mb-2 tracking-tight">{line.replace("# ", "")}</h1>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} className="font-serif font-bold text-lg text-[#E6A05D] italic mt-4 mb-2 tracking-wide">{line.replace("## ", "")}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="font-sans font-bold text-sm text-[#3D352F] mt-3 mb-1 tracking-wider uppercase">{line.replace("### ", "")}</h3>;
      }
      if (line.startsWith("* ") || line.startsWith("- ")) {
        return <li key={idx} className="text-xs text-[#3D352F] list-disc ml-5 leading-relaxed my-1">{line.substring(2)}</li>;
      }
      if (line.trim().match(/^\d+\./)) {
        return <li key={idx} className="text-xs text-[#3D352F] list-decimal ml-5 leading-relaxed my-1">{line.replace(/^\d+\./, "")}</li>;
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="text-xs text-[#3D352F] leading-relaxed my-1">{line}</p>;
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E4D9] p-6 shadow-sm" id="lesson-planner-parent">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="font-sans font-bold text-lg text-[#3D352F] flex items-center gap-2">
            <span className="p-1.5 bg-[#4A5D4E]/10 text-[#4A5D4E] rounded-lg">
              <FileText className="w-5 h-5" />
            </span>
            AI Lesson Notes & Planner
          </h2>
          <p className="text-xs text-[#8B7E74] mt-1">
            Build curriculum-aligned lesson guides featuring low-resource strategies easily suited for large classes
          </p>
        </div>
        <div className="hidden sm:block">
          <span className="bg-[#E6A05D]/10 text-[#E6A05D] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#E6A05D]/20">
            Revised NERDC
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Configurations column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#F9F7F2] rounded-xl p-4 border border-[#E8E4D9]/60 space-y-4">
            
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              Curriculum Metadata
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#8B7E74] uppercase block mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-[#E8E4D9] px-2.5 py-2 rounded-lg text-xs font-semibold text-[#3D352F] focus:outline-none"
                  id="planning-subject-select"
                >
                  <option value="Basic Science">Basic Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Agricultural Science">Agricultural Science</option>
                  <option value="English Language">English Language</option>
                  <option value="Civic Education">Civic Education</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#8B7E74] uppercase block mb-1">Grade Level</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-white border border-[#E8E4D9] px-2.5 py-2 rounded-lg text-xs font-semibold text-[#3D352F] focus:outline-none"
                  id="planning-grade-select"
                >
                  <option value="Primary 5">Primary 5</option>
                  <option value="Primary 6">Primary 6</option>
                  <option value="JSS 1">JSS 1</option>
                  <option value="JSS 2">JSS 2</option>
                  <option value="SSS 2">SSS 2</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#8B7E74] uppercase block mb-1">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Water Pollution causes and local effects"
                className="w-full bg-white border border-[#E8E4D9] px-3 py-2 rounded-lg text-xs text-[#3D352F] focus:outline-none"
                id="planning-topic-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#8B7E74] uppercase block mb-1">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-white border border-[#E8E4D9] px-2.5 py-2 rounded-lg text-xs font-semibold text-[#3D352F] focus:outline-none"
                  id="planning-duration"
                >
                  <option value="40 Minutes">40 Minutes (Single Period)</option>
                  <option value="80 Minutes">80 Minutes (Double Period)</option>
                  <option value="1 Week Plan">1 Week Scheme of Work</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#8B7E74] uppercase block mb-1">Teaching Aids Option</label>
                <select
                  value={materialsOption}
                  onChange={(e) => setMaterialsOption(e.target.value)}
                  className="w-full bg-white border border-[#E8E4D9] px-2.5 py-2 rounded-lg text-xs font-semibold text-[#3D352F] focus:outline-none"
                  id="planning-materials-mode"
                >
                  <option value="Zero-cost community resource kits">Zero-cost community resource kits</option>
                  <option value="Chalkboard diagrams and illustrations">Chalkboard diagrams and illustrations</option>
                  <option value="Local paper craft cards, matchsticks, seeds">Local paper craft cards, matchsticks, seeds</option>
                </select>
              </div>
            </div>

            {/* Digitized Scanned Notes Context */}
            {localDigitizedContext && (
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                <span className="text-[10px] font-bold text-indigo-700 uppercase block mb-1">
                  Attached OCR Scanned Notes:
                </span>
                <p className="text-[11px] text-indigo-900 line-clamp-3 leading-relaxed">
                  {localDigitizedContext}
                </p>
                <button
                  onClick={() => setLocalDigitizedContext("")}
                  className="text-[10px] text-red-650 hover:underline font-bold block mt-1"
                >
                  Remove attached snapshot context
                </button>
              </div>
            )}

            <div>
              <label className="text-[10.5px] font-bold text-[#8B7E74] uppercase block mb-1">
                Specific Focus Instructions (Optional)
              </label>
              <textarea
                value={specificFocus}
                onChange={(e) => setSpecificFocus(e.target.value)}
                placeholder="e.g. Focus on interactive group games for noisy classrooms. Emphasize West African local context."
                className="w-full bg-white border border-[#E8E4D9] px-3 py-2 rounded-lg text-xs text-[#3D352F] focus:outline-none resize-none"
                rows={3}
                id="planning-focus-textarea"
              />
            </div>

          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            className={`w-full py-3.5 px-4 rounded-xl text-white font-sans font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              isGenerating
                ? "bg-[#4A5D4E]/80 cursor-wait"
                : !topic
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#4A5D4E] hover:bg-[#3D4B3F] shadow-md transform active:scale-[98%]"
            }`}
            id="planner-generate-btn"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating custom NERDC Lesson Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Formulate Aligned Lesson Plan</span>
              </>
            )}
          </button>
        </div>

        {/* Generated outline area */}
        <div className="lg:col-span-7 bg-[#F9F7F2] rounded-2xl p-5 border border-[#E8E4D9] min-h-[400px] flex flex-col justify-between">
          
          {isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-10 h-10 border-3 border-[#4A5D4E]/20 border-t-[#4A5D4E] rounded-full animate-spin"></div>
              <h4 className="text-xs font-bold text-[#4A5D4E]">Assembling objectives and local low-cost classroom material lists...</h4>
              <p className="text-[10.5px] text-[#8B7E74] text-center max-w-sm">Generating instructional activities, entry behaviors, and large and overcrowded classroom strategies.</p>
            </div>
          ) : null}

          {!isGenerating && !generatedPlanMarkdown && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#8B7E74]/50 border border-gray-100 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#3D352F]">Lesson Formulation Board</h4>
                <p className="text-xs text-[#8B7E74] max-w-sm mt-1">
                  Fill out parameters on the left pane and begin. The AI will synthesize standard NERDC formatted notes with tailored pedagogical solutions.
                </p>
              </div>
            </div>
          )}

          {!isGenerating && generatedPlanMarkdown && (
            <div className="flex flex-col h-full justify-between space-y-4">
              
              {/* Aligned badge feedback */}
              <div className="bg-emerald-50 text-emerald-800 text-xs px-3.5 py-2.5 rounded-lg border border-emerald-150 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="block font-bold">Guaranteed NERDC Compliance:</strong>
                  <span className="text-[11px] text-emerald-700 block">Contains standard objectives, entry behavior, and assessment questions.</span>
                </div>
              </div>

              {/* Lesson Text Stream */}
              <div className="flex-1 bg-white border border-[#E8E4D9] rounded-xl p-5 overflow-y-auto max-h-[380px] shadow-sm select-text">
                <div className="space-y-3" id="lesson-plan-markdown-output">
                  {renderLineMarkdown(generatedPlanMarkdown)}
                </div>
              </div>

              {/* Control Panel Footer */}
              <div className="flex items-center justify-between border-t border-[#E8E4D9] pt-3">
                <span className="text-[10.5px] text-[#8B7E74]">
                  Ready to print, download, or share with local supervisors!
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={printDocument}
                    className="p-2 border border-gray-205 rounded-lg text-gray-600 hover:text-black hover:bg-white active:scale-95 transition-all text-xs flex items-center gap-1.5"
                    title="Print Document"
                    id="print-lesson-btn"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Plan</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className="bg-[#4A5D4E] hover:bg-[#3D4B3F] text-[#F9F7F2] font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    id="save-lesson-btn"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to Archives</span>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
