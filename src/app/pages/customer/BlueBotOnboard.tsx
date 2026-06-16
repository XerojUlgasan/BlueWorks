import { useState } from "react";
import { useNavigate } from "react-router";
import { Bell, Mic, Paperclip, ArrowRight, Bot } from "lucide-react";
import { DarkToggle } from "../../components/shared";
import { A } from "../../constants";

export default function BlueBotOnboard({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const chips = ["🔧 Leaking pipe", "💡 No electricity", "🪟 Broken door", "❄️ Aircon not cooling", "🪣 Clogged drain"];
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1B3A6B 100%)" }}>
      <div className="flex justify-end p-4 gap-3">
        <DarkToggle dark={dark} toggleDark={toggleDark} light />
        <button className="relative p-2 text-white/70 hover:text-white"><Bell className="w-5 h-5" /></button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: A }}>AR</div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(59,130,246,0.2)", border: "2px solid rgba(59,130,246,0.4)" }}>
          <Bot className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-blue-300 mb-2">BlueBot</h2>
        <h1 className="text-4xl font-extrabold text-white mb-3 text-center" style={{ fontFamily: "Poppins, sans-serif" }}>
          What service do you need?
        </h1>
        <p className="text-blue-200/70 text-center mb-8 max-w-md">
          Describe your problem and I'll find the right worker for you — fast and hassle-free.
        </p>
        <div className="w-full max-w-2xl rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: `1.5px solid ${query ? A : "rgba(255,255,255,0.15)"}`, boxShadow: query ? `0 0 20px ${A}40` : "none", transition: "all 0.2s" }}>
          <textarea value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. My sink is leaking, I need an electrician..."
            rows={3} className="w-full bg-transparent text-white placeholder:text-blue-200/40 text-base resize-none focus:outline-none" />
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-2">
              <button className="p-1.5 rounded-lg text-blue-300/60 hover:text-blue-300"><Mic className="w-5 h-5" /></button>
              <button className="p-1.5 rounded-lg text-blue-300/60 hover:text-blue-300"><Paperclip className="w-5 h-5" /></button>
            </div>
            <button onClick={() => navigate("/app/chat")}
              className="px-5 py-2 rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90" style={{ background: A }}>
              Find Worker <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-5">
          {chips.map((c) => (
            <button key={c} onClick={() => setQuery(c.slice(3))}
              className="px-3 py-1.5 rounded-full text-sm text-blue-200 hover:text-white"
              style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => navigate("/app/discover")} className="mt-10 text-sm text-blue-300/60 hover:text-blue-300 underline underline-offset-2">
          Prefer to search manually? → Browse Workers
        </button>
      </div>
    </div>
  );
}
