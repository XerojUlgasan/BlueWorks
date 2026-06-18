import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { CustomerNav } from "../../components/shared/Nav";
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
    <div className="relative min-h-screen flex flex-col">
      {/* Dark mode background */}
      <div
        className="absolute inset-0 -z-10 hidden dark:block"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1B3A6B 100%)" }}
      />

      <CustomerNav dark={dark} toggleDark={toggleDark} transparent />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24 md:pb-16 pt-20">

        {/* Bot icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5 relative
            bg-blue-100 dark:bg-blue-500/15
            border border-blue-300 dark:border-blue-500/35"
          style={{ boxShadow: "0 0 48px rgba(59,130,246,0.15)" }}
        >
          <Bot className="w-9 h-9 text-blue-600 dark:text-blue-300" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: A }}>
            <Sparkles className="w-3 h-3 text-white" />
          </span>
        </div>

        <p className="text-sm font-semibold tracking-widest uppercase mb-2 text-blue-600 dark:text-blue-400">BlueBot AI</p>
        <h1
          className="text-3xl md:text-4xl font-extrabold mb-3 text-center leading-tight text-gray-900 dark:text-white"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Hi Ana, what do you need help with?
        </h1>
        <p className="text-center mb-8 max-w-md text-sm leading-relaxed text-gray-500 dark:text-blue-200/60">
          Describe your problem and I'll find the right worker for you — fast and hassle-free.
        </p>

        {/* Input box */}
        <div
          className="w-full max-w-2xl flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
            bg-white dark:bg-white/5
            border border-gray-200 dark:border-white/10
            shadow-sm dark:shadow-none
            focus-within:border-blue-400 dark:focus-within:border-blue-400"
          style={{ borderColor: focused ? A : undefined }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && query.trim() && navigate("/app/bluebot")}
            placeholder="e.g. My sink is leaking under the kitchen cabinet..."
            className="flex-1 bg-transparent text-sm focus:outline-none
              text-gray-800 placeholder:text-gray-400
              dark:text-white dark:placeholder:text-blue-200/35"
          />
          <button
            onClick={() => navigate("/app/bluebot")}
            disabled={!query.trim()}
            className="px-4 py-1.5 rounded-xl text-white text-sm font-semibold flex items-center gap-1.5 shrink-0
              transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
            style={{ background: A }}
          >
            Find Worker <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick chips */}
        <div className="flex flex-wrap gap-2 justify-center mt-5 max-w-lg">
          {CHIPS.map((c) => (
            <button
              key={c.label}
              onClick={() => setQuery(c.label)}
              className="px-3 py-1.5 rounded-full text-sm transition-all hover:scale-105 active:scale-95
                border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600
                dark:border-blue-500/25 dark:bg-transparent dark:text-blue-200/70 dark:hover:text-blue-300 dark:hover:border-blue-400"
              style={query === c.label ? { background: `${A}15`, borderColor: A, color: A } : {}}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/app/discover")}
          className="mt-10 text-xs underline underline-offset-4 transition-colors
            text-gray-400 hover:text-blue-600
            dark:text-blue-300/50 dark:hover:text-blue-300"
        >
          Prefer to search manually? Browse Workers →
        </button>
      </div>
    </div>
  );
}
