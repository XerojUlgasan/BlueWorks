import { useState } from "react";
import { useNavigate } from "react-router";
import { Bell, Mic, Paperclip, ArrowRight, Bot, Sparkles } from "lucide-react";
import { DarkToggle } from "../../components/shared";
import { A } from "../../constants";

const CHIPS = [
  { emoji: "🔧", label: "Leaking pipe" },
  { emoji: "💡", label: "No electricity" },
  { emoji: "🪟", label: "Broken door" },
  { emoji: "❄️", label: "Aircon not cooling" },
  { emoji: "🪣", label: "Clogged drain" },
  { emoji: "🎨", label: "Need a painter" },
];

export default function BlueBotOnboard({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const focused = query.length > 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1B3A6B 100%)" }}>
      {/* Top bar */}
      <div className="flex justify-end items-center p-4 gap-2">
        <DarkToggle dark={dark} toggleDark={toggleDark} light />
        <button className="relative p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/20"
          style={{ background: A }}
        >
          AR
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24 md:pb-16">
        {/* Bot icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5 relative"
          style={{
            background: "rgba(59,130,246,0.15)",
            border: "1.5px solid rgba(59,130,246,0.35)",
            boxShadow: "0 0 40px rgba(59,130,246,0.2)",
          }}
        >
          <Bot className="w-9 h-9 text-blue-400" />
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: A }}
          >
            <Sparkles className="w-3 h-3 text-white" />
          </span>
        </div>

        <p className="text-sm font-semibold text-blue-400 tracking-widest uppercase mb-2">BlueBot AI</p>
        <h1
          className="text-3xl md:text-4xl font-extrabold text-white mb-3 text-center leading-tight"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          What service do you need?
        </h1>
        <p className="text-blue-200/60 text-center mb-8 max-w-md text-sm leading-relaxed">
          Describe your problem and I'll find the right worker for you — fast and hassle-free.
        </p>

        {/* Input box */}
        <div
          className="w-full max-w-2xl rounded-2xl p-4 transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1.5px solid ${focused ? A : "rgba(255,255,255,0.12)"}`,
            boxShadow: focused ? `0 0 24px ${A}35` : "none",
          }}
        >
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. My sink is leaking under the kitchen cabinet..."
            rows={3}
            className="w-full bg-transparent text-white placeholder:text-blue-200/35 text-sm leading-relaxed resize-none focus:outline-none"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            <div className="flex gap-1">
              <button className="p-2 rounded-lg text-blue-300/50 hover:text-blue-300 hover:bg-white/10 transition-colors">
                <Mic className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg text-blue-300/50 hover:text-blue-300 hover:bg-white/10 transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => navigate("/app/bluebot")}
              disabled={!query.trim()}
              className="px-5 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
              style={{ background: A }}
            >
              Find Worker <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick chips */}
        <div className="flex flex-wrap gap-2 justify-center mt-5 max-w-lg">
          {CHIPS.map((c) => (
            <button
              key={c.label}
              onClick={() => setQuery(c.label)}
              className="px-3 py-1.5 rounded-full text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                background: query === c.label ? `${A}30` : "rgba(59,130,246,0.1)",
                border: `1px solid ${query === c.label ? A : "rgba(59,130,246,0.25)"}`,
                color: query === c.label ? "#93C5FD" : "rgba(147,197,253,0.7)",
              }}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/app/discover")}
          className="mt-10 text-xs text-blue-300/50 hover:text-blue-300 transition-colors underline underline-offset-4"
        >
          Prefer to search manually? Browse Workers →
        </button>
      </div>
    </div>
  );
}
