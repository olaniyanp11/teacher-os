import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RefreshCw, Bot, User, BrainCircuit, School, Smile, BookOpen } from "lucide-react";

interface TeachingAssistantProps {
  isOffline: boolean;
  triggerNotification: (text: string, type: "success" | "warning" | "info") => void;
  activeSubject?: string;
  activeGrade?: string;
  activeTopic?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const PEDAGOGICAL_PRESETS = [
  {
    title: "Overcrowded Classroom (50+ students)",
    prompt: "Give me 3 practical strategies to organize a group activity for a class of 65 students in a small classroom space under the NERDC syllabus."
  },
  {
    title: "Explain Complex Concept using Local Analogies",
    prompt: "How can I explain electric current, resistance, and voltage to JSS 2 students using Nigerian daily life references like NEPA or commercial transport busses?"
  },
  {
    title: "Improvise Free Lab Materials",
    prompt: "Suggest low-cost or zero-cost local materials substitute for a JSS 1 Basic Science class teaching acids and bases."
  }
];

export default function TeachingAssistant({
  isOffline,
  triggerNotification,
  activeSubject = "Basic Science",
  activeGrade = "JSS 1",
  activeTopic = "",
}: TeachingAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "assistant",
      content: "Hello Teacher! I am your TeacherOS Pedagogical companion. Ask me anything about managing large groups, organizing local experiments, generating WAEC standard objectives, or explaining tricky concepts with funny local analogies."
    }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const rawInput = textToSend || input;
    if (!rawInput.trim()) return;

    if (!textToSend) setInput("");

    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: rawInput,
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsSending(true);

    try {
      if (isOffline) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        let responseContent = "";
        
        if (rawInput.toLowerCase().includes("overcrowded")) {
          responseContent = `**TeacherOS Offline Coach:** 
Here is a strategy tailored for large Nigerian classrooms (50+ students):
1. **Row-to-Row Competitions:** Instead of asking students to get up and form circles, keep them in their seating columns. Assign each column as "Team A", "Team B", etc. Have them write answers on hand boards and raise them.
2. **The "Pass-the-Paper" Tally:** Designate one sheet of paper per row. The first student writes one feature of the topic and passes it back. The last student runs it to the whiteboard. This maintains order and builds peer cooperation.
3. **Numbered Heads Together:** Number students in each bench is 1 to 4. Ask a question, let them huddle for 1 minute on their bench. Then call "All number 3s, stand up and answer!". This ensures positive interdependence!`;
        } else if (rawInput.toLowerCase().includes("nepa") || rawInput.toLowerCase().includes("explain")) {
          responseContent = `**TeacherOS Offline Coach:**
Here's a fantastic local analogy JSS 2 pupils will never forget:
*   **Voltage is the NEPA Transformer:** It represents the force/pressure pushing electricity from the grid into the houses. Higher pressure, brighter bulbs.
*   **Current is the Water Flow or Traffic:** It is the actual amount of electrons or "danfo busses" flowing through the narrow Lagos street.
*   **Resistance is the Street Speedbumps (Pot-holes/Security Gates):** It is what slows down the danfo busses. If there are many potholes (high resistance), the current flows slower, and power drops! Use this diagram on your blackboard to make them laugh and remember.`;
        } else {
          responseContent = `**TeacherOS Offline Coach:** 
Excellent query! For ${activeSubject} at the ${activeGrade} level under the NERDC syllabus, I recommend:
*   **Aesthetic Pairing:** Connect the lesson to daily community experiences (such as buying provisions at the local kiosk or measuring farmland).
*   **Formative check:** Use the 'Think-Pair-Share' technique where bench-partners consult for 30 seconds before answering.
*   **Local materials substitute:** Recycle clean plastic pure-water nylons or mineral plastic bottles to illustrate container shapes, soil horizons, or measurements easily.`;
        }

        setMessages((prev) => [
          ...prev,
          { id: Math.random().toString(), role: "assistant", content: responseContent }
        ]);
        triggerNotification("Answer loaded from educational offline cache!", "success");
      } else {
        const payloadMessages = [...messages, newMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch("/api/assistant/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: payloadMessages,
            context: {
              subject: activeSubject,
              grade: activeGrade,
              region: "Nigeria Local"
            }
          }),
        });

        const resData = await response.json();
        if (resData.success) {
          setMessages((prev) => [
            ...prev,
            { id: Math.random().toString(), role: "assistant", content: resData.reply }
          ]);
        } else {
          throw new Error(resData.error || "Co-pilot assistant failed to respond.");
        }
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Gemini assistant is taking a break. Loaded local tutor reply.", "warning");
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: `**TeacherOS Assistant:**\n\nI can see you're working on ${activeTopic || "your curriculum outline"}.\n\nTo make this class more responsive despite low resources, try writing the main three vocabulary terms on the chalk board in bold green letters, and invite students to act them out as a team. For example, to teach 'Movement', have row B stand and make rowing actions together!`
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#4A5D4E] text-[#F9F7F2] rounded-3xl p-6 shadow-sm flex flex-col h-[580px]" id="teaching-assistant-card">
      
      {/* Mini Title/User bar */}
      <div className="flex items-center justify-between border-b border-[#F9F7F2]/10 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E6A05D] text-white rounded-xl shadow-md">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#F9F7F2] flex items-center gap-1.5">
              TeacherOS AI Assistant
              <span className="bg-[#F0C9A5]/20 text-[#F0C9A5] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                Active
              </span>
            </h3>
            <p className="text-[11px] text-[#F9F7F2]/70">Co-pilot for local teaching challenges</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-[#F9F7F2]/80 bg-[#3D4B3F] px-2.5 py-1 rounded-lg border border-[#5D7061]">
          <School className="w-3.5 h-3.5 text-[#E6A05D]" />
          <span>Active context: JSS 1 Math / Basic Sci</span>
        </div>
      </div>

      {/* Recommended shortcuts list */}
      <div className="mb-4">
        <span className="text-[10px] font-bold text-[#E6A05D] uppercase tracking-widest block mb-1.5">
          Quick Pedagogical Assistants
        </span>
        <div className="flex flex-wrap gap-2">
          {PEDAGOGICAL_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset.prompt)}
              disabled={isSending}
              className="text-left bg-[#3D4B3F] hover:bg-[#5D7061] text-[#F9F7F2] border border-[#5D7061] p-2 rounded-xl text-[10.5px] leading-snug flex-1 min-w-[120px] transition-all"
              id={`assistant-preset-${idx}`}
            >
              <span className="font-bold block text-[#E6A05D] mb-0.5">{preset.title}</span>
              <span className="opacity-90 line-clamp-1">{preset.prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages layout */}
      <div className="flex-1 overflow-y-auto bg-[#3D4B3F] rounded-2xl p-4 space-y-4 mb-4 border border-[#5D7061]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 max-w-[85%] ${
              m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              m.role === "user" ? "bg-[#E6A05D] text-white" : "bg-[#4A5D4E] border border-[#5D7061] text-[#F9F7F2]"
            }`}>
              {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[#E6A05D]" />}
            </div>
            
            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
              m.role === "user" 
                ? "bg-[#5D7061] text-[#F9F7F2] rounded-tr-none" 
                : "bg-[#4A5D4E]/80 text-[#F9F7F2] border border-[#5D7061]/50 rounded-tl-none whitespace-pre-line"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-xs text-[#F9F7F2]/60 italic pl-10">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>AI Coach is brainstorming...</span>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input container */}
      <div className="relative mt-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about curriculum alignment, row activities, or test questions..."
          className="w-full bg-[#3D4B3F] border border-[#5D7061] text-[#F9F7F2] rounded-full py-3.5 pl-4 pr-12 text-xs focus:outline-none focus:ring-1 focus:ring-[#E6A05D] placeholder-[#8B7E74]"
          disabled={isSending}
          id="assistant-chat-input"
        />
        <button
          onClick={() => handleSend()}
          disabled={isSending || !input}
          className="absolute right-2.5 top-2 w-8 h-8 rounded-full bg-[#E6A05D] hover:bg-[#D48F4C] text-[#F9F7F2] flex items-center justify-center transition-all disabled:opacity-50"
          id="assistant-chat-send-btn"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
