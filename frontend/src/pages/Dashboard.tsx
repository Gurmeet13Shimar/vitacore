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
import {
  Heart,
  DollarSign,
  Briefcase,
  Beaker,
  Trophy,
  Settings,
  LayoutDashboard,
  MessageCircle,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

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
                    Your Digital Twin
                  </span>
                </h1>
                <p className="text-neutral-400 max-w-2xl mx-auto mb-8 text-lg">
                  Optimize your life in real-time. Connect your health, wealth, and career data to simulate your future and achieve peak performance.
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
                    Real-time Optimization
                  </h2>
                  <p className="mt-4 text-neutral-300 max-w-lg text-lg">
                    Interact with your digital twin. Visualize your progress and let AI guide your next best action towards your goals.
                  </p>
                  <motion.button
                    whileHover={{ opacity: 0.9, y: -1 }}
                    whileTap={{ y: 0 }}
                    onClick={() => navigate('/simulator')}
                    className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none rounded-full py-3 px-6 font-bold text-sm cursor-pointer w-fit shadow-lg shadow-indigo-500/30"
                  >
                    Run Simulation
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