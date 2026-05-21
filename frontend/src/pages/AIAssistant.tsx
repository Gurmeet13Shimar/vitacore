import React, { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { chatMessages } from "@/data/mockData";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AIAssistant() {
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), sender: "user", text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/api/ai/recommend", {
        domain: "General",
        context: { query: input }
      });
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "ai",
        text: response.data.recommendation || "I am processing that..."
      }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "ai",
        text: "System offline. Please check connection to neural engine."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Optimize my study plan",
    "Analyze spending patterns",
    "Career growth tips"
  ];

  return (
    <AppLayout>
      <div className="h-full flex p-4 gap-4 max-w-7xl mx-auto">
        
        {/* Main Chat Area */}
        <div className="flex-1 glass-card border-primary/20 flex flex-col overflow-hidden relative">
          <div className="p-4 border-b border-primary/20 flex items-center gap-3 bg-black/20">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(109,40,217,0.3)]">
                <Bot size={20} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">VitaCore Neural AI</h2>
              <p className="text-xs text-primary font-medium tracking-widest uppercase">Online & Monitoring</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'user' ? 'bg-white/10 text-foreground' : 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(109,40,217,0.2)]'
                  }`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-foreground rounded-tr-sm' 
                      : 'bg-white/10 border border-primary/20 text-muted-foreground rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 max-w-[85%]"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(109,40,217,0.2)]">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/10 border border-primary/20 text-muted-foreground rounded-tl-sm flex items-center gap-1">
                    <motion.div className="w-2 h-2 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.div className="w-2 h-2 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          <div className="p-4 bg-black/20 border-t border-primary/20">
            <form onSubmit={handleSend} className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query the system..."
                className="flex-1 bg-black/50 border-primary/20 text-foreground h-12 focus-visible:ring-primary"
                data-testid="input-chat"
              />
              <Button type="submit" size="icon" className="h-12 w-12 bg-primary hover:bg-primary/80 text-foreground" disabled={!input.trim()}>
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>

        {/* Right Panel - Suggestions */}
        <div className="w-80 hidden lg:flex flex-col gap-4">
          <div className="glass-card p-6 border-primary/20 flex-1">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-primary" /> Prompt Contexts
            </h3>
            <div className="space-y-3">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => setInput(sug)}
                  className="w-full text-left p-3 rounded-lg bg-white/10 border border-primary/10 hover:bg-white/10 hover:border-primary/50 transition-all text-sm text-muted-foreground hover:text-foreground"
                >
                  {sug}
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-primary/20">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">System Context</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Health DB</span><span className="text-green-400">Synced</span></div>
                <div className="flex justify-between"><span>Finance DB</span><span className="text-green-400">Synced</span></div>
                <div className="flex justify-between"><span>Career DB</span><span className="text-yellow-400">Syncing...</span></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}