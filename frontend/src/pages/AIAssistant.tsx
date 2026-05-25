import React, { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Bot,
  Send,
  User,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AIAssistant() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  /* SEND MESSAGE */
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    /* USER MESSAGE */
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
        }),
      });

      const data = await response.json();

      /* AI RESPONSE */
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.reply || "No response from AI",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "AI connection failed.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Optimize my study plan",
    "Analyze spending patterns",
    "Career growth tips",
  ];

  return (
    <AppLayout theme="default">
      {/* Container matching main app background token */}
      <div className="w-full h-[calc(100vh-4rem)] bg-gradient-to-tr from-[#F3EFF9] to-[#F8F5FC] p-4 md:p-6 flex flex-col">
        
        {/* Subtle Module Navigation */}
        <div className="max-w-7xl w-full mx-auto mb-4 shrink-0">
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Core Systems
          </button>
        </div>

        {/* MAIN CHAT INTERFACE WINDOW */}
        <div className="flex-1 flex gap-6 max-w-7xl w-full mx-auto overflow-hidden min-h-0">
          
          {/* LEFT SIDE: CHAT STREAM */}
          <div className="flex-1 bg-white border border-slate-100 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex flex-col overflow-hidden">
            
            {/* STREAM HEADER */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
                    <Bot size={22} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                
                <div>
                  <h2 className="font-bold text-[#1E293B] text-base leading-tight">
                    VitaCore Neural Assistant
                  </h2>
                  <p className="text-[10px] text-purple-600 font-bold tracking-wider uppercase mt-0.5">
                    Sync Online & Monitoring
                  </p>
                </div>
              </div>

              <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-semibold text-slate-400">
                Contextual Engine v1.2
              </div>
            </div>

            {/* MESSAGE CHAT STREAM AREA */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/30 scrollbar-none">
              <AnimatePresence initial={false}>
                {messages.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3"
                  >
                    <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-2">
                      <Sparkles size={24} />
                    </div>
                    <h3 className="text-base font-bold text-[#1E293B]">System Idle</h3>
                    <p className="text-slate-400 text-sm max-w-sm font-medium">
                      Ask me to run optimization simulations, summarize data metrics, or review your daily nodes.
                    </p>
                  </motion.div>
                )}

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3.5 max-w-[80%] ${
                      msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                    }`}
                  >
                    {/* AVATAR INTERFACE */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                        msg.sender === "user"
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-slate-100 text-purple-600"
                      }`}
                    >
                      {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                    </div>

                    {/* DYNAMIC SPEECH BUBBLES */}
                    <div
                      className={`p-4 rounded-[20px] text-sm leading-relaxed font-medium ${
                        msg.sender === "user"
                          ? "bg-slate-800 text-white rounded-tr-none shadow-sm"
                          : "bg-purple-50/70 border border-purple-100/50 text-slate-700 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* AI RESPONDING TYPING DOTS */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3.5 max-w-[80%]"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 text-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Bot size={14} />
                    </div>

                    <div className="p-4 rounded-[20px] bg-purple-50/70 border border-purple-100/50 rounded-tl-none flex items-center gap-1.5 h-11">
                      {[0, 0.2, 0.4].map((delay, index) => (
                        <motion.div
                          key={index}
                          className="w-2 h-2 bg-purple-500 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: delay,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* INPUT MESSAGE UTILITY BAR */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSend} className="flex gap-3 relative items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your digital twin assistant..."
                  className="flex-1 bg-slate-50/80 border-slate-200/60 rounded-2xl text-[#1E293B] focus-visible:ring-purple-500 focus-visible:ring-offset-0 h-12 text-sm px-4 placeholder:text-slate-400"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-12 w-12 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition-all shadow-md shrink-0 flex items-center justify-center"
                >
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </div>

          {/* RIGHT SIDE: PROMPT CONTEXT SUGGESTIONS PANEL */}
          <div className="w-80 hidden lg:flex flex-col shrink-0">
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] h-full flex flex-col">
              
              <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-2 mb-5 shrink-0">
                <Sparkles size={16} className="text-purple-600" />
                Prompt Contexts
              </h3>

              <div className="space-y-3 overflow-y-auto pr-1 flex-1 scrollbar-none">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(sug)}
                    className="w-full text-left p-4 rounded-2xl bg-slate-50/60 border border-slate-100/70 hover:bg-purple-50/40 hover:border-purple-200/60 text-slate-600 hover:text-purple-700 transition-all text-xs font-semibold leading-normal"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 text-[11px] font-medium text-slate-400 leading-relaxed shrink-0">
                Selecting a prompt context populates the engine input query automatically.
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}