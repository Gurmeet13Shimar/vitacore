import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Github, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex text-foreground relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-pink-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="flex-1 flex flex-col justify-center px-12 md:px-24 z-10 hidden lg:flex border-r border-white/10 glass-card rounded-none border-y-0 border-l-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-3xl shadow-[0_0_30px_rgba(109,40,217,0.5)] mb-8">
            VC
          </div>
          <h1 className="text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            The Cockpit <br/>For Your Life.
          </h1>
          <p className="text-xl text-muted-foreground max-w-md">
            Optimize your Health, Finance, and Career through AI analytics and real-time simulations.
          </p>
          
          <div className="mt-12 flex gap-4">
            <div className="glass-card p-4 flex items-center gap-3 rounded-xl border-primary/20">
              <Bot className="text-primary" />
              <span className="text-sm font-medium">Neural Engine Active</span>
            </div>
            <div className="glass-card p-4 flex items-center gap-3 rounded-xl border-blue-500/20">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span className="text-sm font-medium">Systems Nominal</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md glass-card p-8 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl pointer-events-none" />
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Enter your credentials to access the grid.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-20">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Identity Identifier</label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/50 border-white/10 focus-visible:ring-primary h-12 text-white"
                data-testid="input-email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Access Node</label>
                <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">Recover access</a>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/50 border-white/10 focus-visible:ring-primary h-12 text-white"
                data-testid="input-password"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-6"
              data-testid="button-submit-login"
            >
              INITIALIZE UPLINK
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Or connect via</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <div className="mt-6 flex gap-4">
            <Button variant="outline" className="flex-1 h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-all text-gray-300" onClick={handleSubmit}>
              <Github className="mr-2" size={18} />
              GitHub
            </Button>
            <Button variant="outline" className="flex-1 h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-all text-gray-300" onClick={handleSubmit}>
              <Mail className="mr-2" size={18} />
              Google
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}