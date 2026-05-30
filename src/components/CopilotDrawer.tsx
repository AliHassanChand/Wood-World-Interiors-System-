/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send, X, Bot, AlertTriangle, ArrowRight, User } from "lucide-react";
import { AIInsight, BranchName, Order, StockItem } from "../types";

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextData: {
    stockItems: StockItem[];
    orders: Order[];
    approvalsCount: number;
    activeBranch: BranchName;
  };
  onApplyAction: (actionType: string, payload?: any) => void;
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function CopilotDrawer({ isOpen, onClose, contextData, onApplyAction }: CopilotDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "As Wood World's AI Business Copilot, I have audited our current inventory levels and orders in Karachi, Lahore, and Islamabad.\n\nType a custom request or check one of our automated operational suggestions below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested dynamic prompt chips based on system state
  const smartSuggestions = [
    { label: "Analyze Karachi low stock", prompt: "Perform a stock analysis for Karachi Showroom and suggest stock transfers to avoid stockout." },
    { label: "Check due installments", prompt: "Who are the customers with pending installment payments and when are they due? Suggest payment strategies." },
    { label: "Generate daily summary", prompt: "Create an executive summarized brief of Wood World Enterprise operations today including branch sales and pending actions." },
    { label: "Review Islamabad discount requests", prompt: "Check Islamabad's pending approvals. Is it strategically viable to approve those customer discounts?" }
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    setErrorMsg("");

    const userMessage: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/copilot", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           message: textToSend,
           history: messages,
           context: contextData,
         }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to reach AI Business Copilot. Please make sure the server status is active and secrets are configured.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#151515] border-l border-white/5 shadow-2xl flex flex-col focus-element" id="copilot-panel">
      {/* Drawer Header */}
      <div className="p-4 bg-[#1C1C1C] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#C5A059]/10 rounded text-[#C5A059] border border-[#C5A059]/10">
            <Sparkles className="w-5 h-5 animate-pulse text-[#C5A059]" />
          </div>
          <div>
            <h3 className="font-serif italic font-bold text-[#E5E5E5] text-sm tracking-wide">WOOD WORLD COPILOT</h3>
            <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-widest font-semibold">Active Executive AI</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#1A1A1A] text-neutral-400 hover:text-neutral-200 rounded transition-colors cursor-pointer"
          id="close-copilot-btn"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-behavior-smooth bg-[#0F0F0F]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-[85%] ${
              m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`w-7 h-7 rounded flex items-center justify-center shrink-0 border ${
                m.role === "user"
                  ? "bg-[#C5A059]/10 border-[#C5A059]/35 text-[#C5A059]"
                  : "bg-[#151515] border-white/5 text-[#C5A059]"
              }`}
            >
              {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`p-3 rounded text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-[#C5A059]/10 text-[#E5E5E5] border border-[#C5A059]/20"
                  : "bg-[#151515] text-[#E5E5E5]/90 border border-white/5"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-7 h-7 rounded bg-[#151515] border border-white/5 text-[#C5A059] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin text-[#C5A059]" />
            </div>
            <div className="py-3 px-4 rounded bg-[#151515] text-neutral-400 border border-white/5 text-xs italic flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-bounce" style={{ animationDelay: "300ms" }} />
              Analyzing Wood World ERP database...
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-950/20 border border-red-900/35 rounded-xl text-red-300 text-xs flex gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <div>
              <p className="font-semibold">Operation Unsuccessful</p>
              <p className="mt-0.5 opacity-90">{errorMsg}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Triggers */}
      <div className="p-3 bg-[#151515] border-t border-white/5">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold mb-2">Guided Actions</p>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          {smartSuggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s.prompt)}
              className="text-[10px] bg-[#0F0F0F] hover:bg-[#C5A059]/10 text-[#C5A059] hover:text-white border border-white/5 hover:border-[#C5A059]/30 py-1 px-2.5 rounded transition-all text-left flex items-center gap-1 cursor-pointer"
            >
              <span>{s.label}</span>
              <ArrowRight className="w-3 h-3 text-[#C5A059] shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3 bg-[#151515] border-t border-white/5 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Copilot (e.g. recommend inventory transfers...)"
          className="flex-1 bg-[#0F0F0F] border border-white/5 focus:border-[#C5A059]/40 rounded py-2 px-3 text-xs text-neutral-200 placeholder-neutral-600 outline-none transition-all"
          id="copilot-chat-input"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 bg-[#C5A059] disabled:bg-[#1A1A1A] disabled:text-stone-600 text-[#0F0F0F] font-bold rounded transition-all cursor-pointer"
          id="send-chat-btn"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
