import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Mail, Lock, User, Zap } from "lucide-react";

interface FormInputProps {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  dataTestId?: string;
}

interface SocialButtonProps {
  icon: React.ReactNode;
  name: string;
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  id: string;
}

interface BackgroundProps {
  imageUrl: string;
}

// FormInput Component
const FormInput: React.FC<FormInputProps> = ({ icon, type, placeholder, value, onChange, required, dataTestId }) => {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 z-20 pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        data-testid={dataTestId}
        className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all relative z-10 text-sm"
      />
    </div>
  );
};

// SocialButton Component
const SocialButton: React.FC<SocialButtonProps> = ({ icon, name }) => {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all text-xs font-semibold cursor-pointer"
    >
      {icon}
      <span>{name}</span>
    </button>
  );
};

// ToggleSwitch Component
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, id }) => {
  return (
    <div className="relative inline-block w-9 h-5 cursor-pointer align-middle select-none">
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        onClick={onChange}
        className={`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-violet-500' : 'bg-white/10 border border-white/10'}`}
      >
        <div className={`absolute left-0.5 top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 ease-in-out ${checked ? 'transform translate-x-4' : ''}`} />
      </div>
    </div>
  );
};

// Image Background Component
const Background: React.FC<BackgroundProps> = ({ imageUrl }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />
      <img
        src={imageUrl}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

// Main Login Page Component
export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Visual Image Background */}
      <Background imageUrl="https://i.pinimg.com/1200x/e6/6e/66/e66e66a33eee270aee3f6092de07accf.jpg" />

      {/* Floating auth card with glassmorphism */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className="w-full max-w-[420px] p-8 rounded-[28px] backdrop-blur-xl bg-[#0e0a24]/75 border border-violet-500/20 shadow-2xl relative z-20 overflow-hidden"
        style={{
          boxShadow: "0 24px 64px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Subtle top inner purple glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none" />

        {/* Branding & Logo */}
        <div className="mb-8 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center font-black text-base text-white shadow-lg shadow-violet-500/30 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              VC
            </div>
          </div>
          <h2 className="text-3xl font-black mb-1 relative tracking-tight text-white">
            <span className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 via-fuchsia-500/30 to-pink-500/30 blur-xl opacity-75 animate-pulse pointer-events-none"></span>
            <span className="relative bg-gradient-to-r from-white via-violet-100 to-fuchsia-200 bg-clip-text text-transparent">
              {isRegistering ? "Sign Up" : "Login"}
            </span>
          </h2>
          <p className="text-violet-200/50 text-[10px] font-bold uppercase tracking-widest">
            VitaCore Digital Twin
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold animate-pulse">
              {error}
            </div>
          )}

          {/* Conditional Name Field for Sign Up Mode */}
          {isRegistering && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-[10px] font-bold text-violet-300/60 uppercase tracking-widest ml-1">
                Name
              </label>
              <FormInput
                icon={<User size={16} />}
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-violet-300/60 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <FormInput
              icon={<Mail size={16} />}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dataTestId="input-email"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-violet-300/60 uppercase tracking-widest ml-1">
                Password
              </label>
            </div>
            <div className="relative">
              <FormInput
                icon={<Lock size={16} />}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dataTestId="input-password"
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-20 focus:outline-none cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <ToggleSwitch
                checked={remember}
                onChange={() => setRemember(!remember)}
                id="remember-me"
              />
              <label
                htmlFor="remember-me"
                className="text-[11px] text-white/60 cursor-pointer hover:text-white transition-colors select-none"
              >
                Remember me
              </label>
            </div>
            {!isRegistering && (
              <a href="#" className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Forgot password?
              </a>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            data-testid="button-submit-login"
            className="w-full mt-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-1 focus:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 shadow-violet-500/20 hover:shadow-violet-500/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap size={14} className="text-amber-300 fill-amber-300 animate-pulse" />
                {isRegistering ? "Sign Up" : "Login"}
              </>
            )}
          </button>
        </form>



        {/* Toggle Register / Login */}
        <p className="mt-6 text-center text-xs text-white/50 relative z-10">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
            }}
            className="font-bold text-violet-400 hover:text-violet-300 transition-colors ml-1 focus:outline-none cursor-pointer"
          >
            {isRegistering ? "Login" : "Sign Up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}