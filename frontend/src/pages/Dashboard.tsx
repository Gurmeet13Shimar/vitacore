import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { Dock } from '@/components/ui/dock';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { Card } from '@/components/ui/card';
import { ParallaxScrollFeatureSection } from '@/components/ui/parallax-scroll-feature-section';
import {
  Heart,
  DollarSign,
  Briefcase,
  Beaker,
  Trophy,
  Settings,
  LayoutDashboard,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: "Health & Exercise",
      description: "Keep track of your sleep, exercise, and calorie logs. Learn how your habits affect your energy levels so you can feel great every single day.",
      imageUrl: "https://i.pinimg.com/1200x/d2/73/e9/d273e9dcc92886bd6175dc868b3bf307.jpg",
      reverse: false,
    },
    {
      id: 2,
      title: "Career & Coding Goals",
      description: "Set study targets, log your practice hours on top platforms, and build a strong habit of daily learning to reach your professional milestones.",
      imageUrl: "https://i.pinimg.com/736x/d9/3f/de/d93fdee3f500c2620ad71b8c3fcb69fe.jpg",
      reverse: true,
    },
    {
      id: 3,
      title: "Simple Money Tracking",
      description: "Log your income and daily expenses to see your savings grow. Plan ahead for your financial targets with simple, interactive calculators.",
      imageUrl: "https://i.pinimg.com/736x/a6/c5/8c/a6c58c8f90b48522eaaa052252e7e14a.jpg",
      reverse: false,
    },
    {
      id: 4,
      title: "Fun Milestones & Badges",
      description: "Stay excited by unlocking fun achievements as you build daily habits. Celebrate your consistency and track your logs in one simple list.",
      imageUrl: "https://i.pinimg.com/1200x/0b/75/d5/0b75d5eec848cf109676e9744b97524e.jpg",
      reverse: true,
    },
  ];

  const dockItems = [
    { icon: LayoutDashboard, label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { icon: Heart, label: 'Health', onClick: () => navigate('/health') },
    { icon: DollarSign, label: 'Finance', onClick: () => navigate('/finance') },
    { icon: Briefcase, label: 'Career', onClick: () => navigate('/career') },
    { icon: Beaker, label: 'Simulator', onClick: () => navigate('/simulator') },
    { icon: Trophy, label: 'Achievements', onClick: () => navigate('/achievements') },
    { icon: Settings, label: 'Settings', onClick: () => navigate('/settings') },
  ];

  return (
    <AppLayout>
      <div style={{ background: '#07071A', minHeight: '100%', position: 'relative', color: '#ffffff' }}>
        <div className="flex flex-col overflow-hidden pb-[100px] pt-[40px]">
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="text-4xl font-semibold text-white mb-4">
                  Welcome to Vitacore, {user?.name || 'Explorer'} <br />
                  <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                    My Life Dashboard
                  </span>
                </h1>
                <p className="text-neutral-400 max-w-2xl mx-auto mb-8 text-lg">
                  Improve your daily routine. Track your sleep, wealth, and career study targets to stay on track and reach your goals.
                </p>
              </>
            }
          >
            {/* The 3D Scene embedded inside the Container Scroll */}
            <Card className="w-full h-full bg-black/[0.96] relative overflow-hidden border-0 rounded-2xl">
              <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
              />
              
              <div className="flex flex-col md:flex-row h-full">
                {/* Left content inside Card */}
                <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                    Track Your Progress
                  </h2>
                  <p className="mt-4 text-neutral-300 max-w-lg text-lg">
                    Check your numbers daily, visualize your trends, and let simple advice help you take your next steps.
                  </p>
                  <motion.button
                    whileHover={{ opacity: 0.9, y: -1 }}
                    whileTap={{ y: 0 }}
                    onClick={() => navigate('/simulator')}
                    className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none rounded-full py-3 px-6 font-bold text-sm cursor-pointer w-fit shadow-lg shadow-indigo-500/30"
                  >
                    Try Simulator
                  </motion.button>
                </div>

                {/* Right content (3D Scene) */}
                <div className="flex-1 relative min-h-[300px]">
                  <SplineScene 
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </Card>
          </ContainerScroll>
        </div>

        {/* Feature Scroll Section */}
        <ParallaxScrollFeatureSection features={features} />

        {/* Dashboard Summary Card */}
        <div className="max-w-5xl mx-auto px-6 mb-12 relative z-20">
          <motion.div
            whileHover={{ y: -3 }}
            className="glass-card border border-violet-500/25 bg-slate-950/85 backdrop-blur-xl p-8 rounded-3xl relative overflow-hidden shadow-2xl"
          >
            {/* Ambient glow in card background */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
              <div className="flex-1 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-4">
                  <Sparkles className="h-3 w-3 animate-pulse" /> Active Life Status
                </span>
                
                <h2 className="text-3xl font-black text-white tracking-tight">
                  My Dashboard Summary
                </h2>
                
                <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                  See your healthy habits, wealth progress, and career milestones all together in one place. Keep an eye on your numbers, read easy daily tips, and hit your goals.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    <span>Daily Health & Wealth Scores</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    <span>Simple Goal Tracking Cards</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    <span>Friendly Tips & Advice</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    <span>Your Daily Habits Log</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/goals')}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black px-8 py-4 rounded-2xl border-0 shadow-lg shadow-violet-500/25 flex items-center gap-2 text-sm cursor-pointer"
                >
                  <span>Open My Tracker</span>
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Dock */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '24px 0 64px 0',
          position: 'relative',
          zIndex: 40
        }}>
          <Dock items={dockItems} />
        </div>

        {/* Floating Chat Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5, type: 'spring', stiffness: 260 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(79,70,229,0.35)',
            zIndex: 50,
          }}
        >
          <MessageCircle size={22} color="#fff" strokeWidth={2} />
        </motion.button>
      </div>
    </AppLayout>
  );
}