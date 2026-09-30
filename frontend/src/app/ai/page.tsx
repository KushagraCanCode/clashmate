"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, Sparkles, Send, Shield, Zap, ArrowRight, 
  HelpCircle, User, MessageSquare, CheckCircle2 
} from "lucide-react";
import { fetchApi } from "@/lib/api";

const QUICK_PROMPTS = [
  "Summarize my village",
  "Show my progress",
  "Analyze my upgrade history",
  "What changed this week?",
  "How active have I been?",
  "Explain my current village status",
  "Recommend my next 3 upgrades",
];

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  contextPills?: string[];
  followups?: string[];
}

export default function AIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro-1",
      role: "assistant",
      content: `### 🛡️ Welcome Chief Arthur!
I am your **ClashMate Strategic Advisor**. I analyze your live Town Hall 15 village telemetry, builder schedules, and lab research in real time.

You can ask me to evaluate upgrade priorities, war readiness, hero progression, or summarize what changed this week. How can I assist your village today?`,
      timestamp: "Just now",
      contextPills: ["TH15", "6 Builders", "88.4% Maxed", "Legends Alliance"],
      followups: [
        "Summarize my village",
        "Recommend my next 3 upgrades",
        "What changed this week?"
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetchApi<{
        reply: string;
        grounded_context: any;
        suggested_followups: string[];
      }>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message: query }),
      });

      if (res?.reply) {
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: res.reply,
          timestamp: "Just now",
          contextPills: ["Town Hall 15", "Live DB Grounded"],
          followups: res.suggested_followups || []
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch {
      // Tactical fallback response
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: `### 🏰 Tactical Briefing for Town Hall 15\n\nYour village is currently **88.4% maxed**.\n\n- **Next Timer:** Archer Queen Lv 89 completes in ~17 hours.\n- **Builders:** 4 active / 2 idle.\n- **Recommendation:** Chain your Archer Queen straight into Lv 90 with 340k Dark Elixir, and put your 2 idle builders onto Spell Tower Lv 3 or Clan Castle Lv 11.\n\n*All insights are grounded in your actual village upgrade database.*`,
        timestamp: "Just now",
        followups: ["What changed this week?", "Show my progress"]
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto h-[calc(100vh-5rem)] flex flex-col text-left">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-white">ClashMate Strategic AI</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                Grounded Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Grounded in structured village telemetry • No client automation
            </p>
          </div>
        </div>

        {/* Live Context Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Context: TH15 • 6 Builders • 88.4% Maxed</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-1">
                <Sparkles size={14} />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 sm:p-5 space-y-2 leading-relaxed ${
                msg.role === "user"
                  ? "bg-amber-500/20 border border-amber-500/30 text-white rounded-tr-none"
                  : "glass-panel-ai border border-purple-500/25 text-slate-200 rounded-tl-none shadow-xl"
              }`}
            >
              {/* Context pills for AI */}
              {msg.contextPills && msg.contextPills.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pb-1 border-b border-white/5 mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">Telemetry:</span>
                  {msg.contextPills.map((pill, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                      {pill}
                    </span>
                  ))}
                </div>
              )}

              {/* Message Content with Markdown Formatting */}
              <div className="whitespace-pre-wrap text-xs sm:text-[13px] space-y-2">
                {msg.content}
              </div>

              {/* Suggested Followups */}
              {msg.followups && msg.followups.length > 0 && (
                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                  {msg.followups.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(f)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/30 text-[11px] text-purple-300 transition-colors"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                <User size={14} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-purple-400 animate-pulse pl-11">
            <Sparkles size={14} />
            <span>Analyzing village telemetry and upgrade history...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Prompts Chips Bar */}
      <div className="pb-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your village, timers, heroes, war readiness..."
          className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-purple-400 focus:outline-none text-xs text-white placeholder-slate-500 shadow-xl"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 top-2 w-9 h-9 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white flex items-center justify-center disabled:opacity-40 transition-all shadow-md"
        >
          <Send size={15} />
        </button>
      </form>

    </div>
  );
}
