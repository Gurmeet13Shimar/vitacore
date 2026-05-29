import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#030712] font-sans">
      
      {/* Background ambient glow orbs */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-radial-gradient from-violet-600/10 to-transparent rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-radial-gradient from-pink-600/10 to-transparent rounded-full pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[440px] mx-4"
      >
        <div className="glass-card neon-border border-0 bg-slate-900/60 backdrop-blur-xl p-8 text-center flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-md shadow-rose-950/20">
              <AlertCircle className="h-8 w-8 text-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-200 tracking-tight">
                404 Page Not Found
              </h1>
              <p className="mt-2 text-sm text-slate-400 font-semibold leading-relaxed">
                The requested coordinate vector does not exist or the link has been disconnected.
              </p>
            </div>
          </div>

          <Link to="/dashboard">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white font-extrabold text-sm rounded-xl cursor-pointer shadow-lg shadow-violet-950/20"
            >
              Back to Dashboard
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
