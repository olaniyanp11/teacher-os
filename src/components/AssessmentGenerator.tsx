import React, { useState } from "react";
import { Download, PlusCircle, CheckCircle2, Sparkles, RefreshCw, FileQuestion, GraduationCap } from "lucide-react";

interface AssessmentGeneratorProps {
  isOffline: boolean;
  onSaveQuiz: (quiz: any) => void;
  triggerNotification: (text: string, type: "success" | "warning" | "info") => void;
  activeTopic?: string;
  activeSubject?: string;
  activeGrade?: string;
}

export default function AssessmentGenerator({
  isOffline,
  onSaveQuiz,
  triggerNotification,
  activeTopic = "",
  activeSubject = "Basic Science",
  activeGrade = "JSS 1",
}: AssessmentGeneratorProps) {
  const [subject, setSubject] = useState(activeSubject);
  const [grade, setGrade] = useState(activeGrade);
  const [topic, setTopic] = useState(activeTopic);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState("Medium");
  const [style, setStyle] = useState("Objective (Multiple Choice)");
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizResult, setQuizResult] = useState<any | null>(null);

  React.useEffect(() => {
    if (activeTopic) setTopic(activeTopic);
    if (activeSubject) setSubject(activeSubject);
    if (activeGrade) setGrade(activeGrade);
  }, [activeTopic, activeSubject, activeGrade]);

  const handleGenerate = async () => {
    if (!topic) {
      triggerNotification("Please fill in a Topic for the assessment", "warning");
      return;
    }

    setIsGenerating(true);
    setQuizResult(null);
    triggerNotification("Formulating curriculum-aligned evaluation questions...", "info");

    try {
      if (isOffline) {
        await new Promise((resolve) => setTimeout(resolve, 1400));
        const offlineData = {
          instructions: `Attempt all questions. Each carries equal marks. Focus area: ${topic}.`,
          questions: [
            {
              number: 1,
              questionText: `Which of the following aligns primary features of ${topic} for secondary analysis?`,
              options: ["Option A - Standard concept details", "Option B - Local non-aligned form", "Option C - Secondary material outline", "Option D - None of the above"],
              correctOption: "A",
              sampleAnswer: "Provide logical reasoning referencing state-level guidelines.",
              learningOutcomeMatched: "Recall and state elementary characteristics of target syllabus."
            },
            {
              number: 2,
              questionText: `How does the study of ${topic} improve local agricultural / mechanical outcomes in Nigerian states?`,
              options: ["Improves community resource pooling", "Reduces waste in market centers", "Secures local food availability", "All of the above"],
              correctOption: "D",
              sampleAnswer: "Detail structural variables present in central markets.",
              learningOutcomeMatched: "Apply localized concepts to state market logistics."
            }
          ],
          markingScheme: "Each question is awarded 5 marks. Partially correct answers in essay/theory get 2 marks."
        };
        setQuizResult(offlineData);
        triggerNotification("Generated quiz via Offline Cache engine!", "success");
      } else {
        const response = await fetch("/api/assessment/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grade,
            subject,
            topic,
            questionCount,
            difficulty,
            style,
          }),
        });

        const resData = await response.json();
        if (resData.success) {
          setQuizResult(resData.data);
          triggerNotification("Highly customized exam quiz successfully generated!", "success");
        } else {
          throw new Error(resData.error || "Quiz failed to generate.");
        }
      }
    } catch (err: any) {
      console.error(err);
      triggerNotification("AI Generator failed or unconfigured. Creating local assessment outline.", "warning");
      setQuizResult({
        instructions: `ANSWER ALL QUESTIONS. Answer clearly. Topic: ${topic || "Target Topic"}.`,
        questions: [
          {
            number: 1,
            questionText: `Differentiate between classic forms of ${topic || "the target topic"} and its locally observed adaptations in West Africa.`,
            options: [],
            sampleAnswer: "Essay format response highlighting at least 3 separate structural differences.",
            learningOutcomeMatched: "Differentiates with clear metrics"
          },
          {
            number: 2,
            questionText: `State three ways a student can use easily sourced regional components to experiment on ${topic || "the target concept"}.`,
            options: [],
            sampleAnswer: "Uses low cost cardboard, nylon bags, or soda cans to present concepts safely.",
            learningOutcomeMatched: "Identifies alternative improvisational materials."
          }
        ],
        markingScheme: "Allocation: 10 marks total. 5 marks awarded for each correct proof or illustration."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToArchive = () => {
    if (!quizResult) return;
    const item = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toLocaleDateString(),
      grade,
      subject,
      topic,
      questionCount,
      difficulty,
      style,
      data: quizResult,
    };
    onSaveQuiz(item);
    triggerNotification("Assessment saved to archives and downloaded in local browser cache!", "success");
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E4D9] p-6 shadow-sm" id="assessment-generator-card">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="font-sans font-bold text-lg text-[#3D352F] flex items-center gap-2">
            <span className="p-1.5 bg-[#E6A05D]/10 text-[#E6A05D] rounded-lg">
              <FileQuestion className="w-5 h-5" />
            </span>
            Assessment & Class Test Generator
          </h2>
          <p className="text-xs text-[#8B7E74] mt-1">
            Instantly build objective quiz questions or written essays complete with full marking guides
          </p>
        </div>
        <div>
          <span className="bg-[#4A5D4E]/10 text-[#4A5D4E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Examiner AI
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Settings Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#F9F7F2] p-4 rounded-xl border border-[#E8E4D9]/60 space-y-4">
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#8B7E74] uppercase block mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-[#E8E4D9] px-2.5 py-2 rounded-lg text-xs font-semibold text-[#3D352F] focus:outline-none"
                  id="quiz-subject-select"
                >
                  <option value="Basic Science">Basic Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Agricultural Science">Agricultural Science</option>
                  <option value="English Language">English Language</option>
                  <option value="Civic Education">Civic Education</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#8B7E74] uppercase block mb-1">Class</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-white border border-[#E8E4D9] px-2.5 py-2 rounded-lg text-xs font-semibold text-[#3D352F] focus:outline-none"
                  id="quiz-grade-select"
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
                placeholder="e.g. Classification of local farm weed plants"
                className="w-full bg-white border border-[#E8E4D9] px-3 py-2 rounded-lg text-xs text-[#3D352F] focus:outline-none placeholder:text-gray-450"
                id="quiz-topic-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#8B7E74] uppercase block mb-1">Count</label>
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full bg-white border border-[#E8E4D9] px-3 py-1.5 rounded-lg text-xs text-[#3D352F] focus:outline-none"
                  id="quiz-count-input"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#8B7E74] uppercase block mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-white border border-[#E8E4D9] px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#3D352F] focus:outline-none"
                  id="quiz-diff-select"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard (WAEC/NECO Standard)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#8B7E74] uppercase block mb-1">Format Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-white border border-[#E8E4D9] px-2.5 py-2 rounded-lg text-xs font-semibold text-[#3D352F] focus:outline-none"
                id="quiz-style-select"
              >
                <option value="Objective (Multiple Choice)">Objective (Multiple Choice)</option>
                <option value="Theory & Essay">Theory & Essay Questions</option>
                <option value="Fill in the Blanks">Fill-in-the-Blanks / Short Q&A</option>
              </select>
            </div>

          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            className={`w-full py-3 px-4 rounded-xl text-white font-sans font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              isGenerating
                ? "bg-[#E6A05D]/70 cursor-wait"
                : !topic
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#E6A05D] hover:bg-[#D48F4C] shadow-sm transform active:scale-[98%]"
            }`}
            id="quiz-submit-btn"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Formulating Nigerian Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Assessment Sheet</span>
              </>
            )}
          </button>
        </div>

        {/* Output Panel layout */}
        <div className="lg:col-span-7 bg-[#F2EDE4]/40 rounded-2xl p-5 border border-[#E8E4D9] min-h-[380px] flex flex-col justify-between">
          
          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#4A5D4E]/20 border-t-[#4A5D4E] rounded-full animate-spin"></div>
              <h4 className="text-xs font-bold text-[#4A5D4E]">Aligning test items with National Curriculum objectives...</h4>
              <p className="text-[10px] text-[#8B7E74]">Writing marking guidelines and grading suggestions...</p>
            </div>
          )}

          {!isGenerating && !quizResult && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#8B7E74]/60 border border-gray-100 shadow-sm">
                <FileQuestion className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#3D352F]">Assessment Preview Area</h4>
                <p className="text-xs text-[#8B7E74] max-w-sm mt-1">
                  Specify your class context details and click "Generate" to receive a student exam sheet with separate class marking guide solutions.
                </p>
              </div>
            </div>
          )}

          {!isGenerating && quizResult && (
            <div className="flex flex-col h-full justify-between space-y-4">
              
              {/* Instructions banner */}
              <div className="bg-white rounded-xl p-4 border border-[#E8E4D9] shadow-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
                  <span className="text-[10px] font-bold text-[#E6A05D] uppercase tracking-wider">Exam Sheet Template</span>
                  <span className="text-[10px] font-bold bg-[#4A5D4E] text-[#F9F7F2] px-2 py-0.5 rounded uppercase">
                    {difficulty} Level
                  </span>
                </div>
                <p className="text-xs text-[#3D352F] font-semibold italic">
                  "Instructions: {quizResult.instructions}"
                </p>
              </div>

              {/* Questions Stream */}
              <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3.5 pr-1">
                {quizResult.questions.map((q: any, index: number) => {
                  const isObj = q.options && q.options.length > 0;
                  return (
                    <div key={index} className="bg-white p-4 rounded-xl border border-[#E8E4D9] space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-[#4A5D4E]">Question {q.number || index + 1}</span>
                        {q.learningOutcomeMatched && (
                          <span className="text-[9px] font-bold text-[#8B7E74] uppercase tracking-wide">
                            🎯 {q.learningOutcomeMatched}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-[#3D352F] font-semibold leading-relaxed">
                        {q.questionText}
                      </p>

                      {isObj && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt: string, optIdx: number) => {
                            const optChar = String.fromCharCode(65 + optIdx);
                            const isCorrect = q.correctOption === optChar;
                            return (
                              <div
                                key={optIdx}
                                className={`p-2 rounded-lg text-xs border ${
                                  isCorrect
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                    : "bg-gray-50 border-gray-150 text-gray-700"
                                }`}
                              >
                                <strong>{optChar}.</strong> {opt}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="bg-[#F9F7F2] p-2.5 rounded-lg text-[11px] leading-relaxed border-l-2 border-[#E6A05D]">
                        <strong className="text-[#3D352F] block">Teacher Answer Scheme:</strong>
                        <span className="text-[#8B7E74]">{q.sampleAnswer}</span>
                        {isObj && <span className="block mt-1 font-bold text-emerald-700">Correct Key: Option {q.correctOption}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Marking Scheme overall tip */}
              <div className="bg-[#4A5D4E]/5 p-3 rounded-xl border border-[#4A5D4E]/20">
                <span className="text-[10px] font-bold text-[#4A5D4E] uppercase block mb-1">
                  Overall Grading & Marking Rubrics
                </span>
                <p className="text-xs text-[#3D352F] italic">
                  {quizResult.markingScheme}
                </p>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between border-t border-[#E8E4D9] pt-3">
                <span className="text-[10.5px] text-[#8B7E74] font-medium">
                  {grade} • {subject} • {quizResult.questions.length} items
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={saveToArchive}
                    className="bg-[#4A5D4E] hover:bg-[#3D4B3F] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow active:scale-95 transition-all"
                    id="save-quiz-to-store"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Save Assessment Sheet</span>
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
