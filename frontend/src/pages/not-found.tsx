import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: "#030712",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background ambient glow orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "20%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "20%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, rgba(233,30,140,0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "440px",
          margin: "0 16px",
        }}
      >
        <div
          style={{
            background: "rgba(16, 12, 38, 0.82)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(139, 92, 246, 0.14)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.40)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#e2d9ff",
                  letterSpacing: "-0.025em",
                }}
              >
                404 Page Not Found
              </h1>
              <p
                style={{
                  marginTop: "8px",
                  fontSize: "14px",
                  color: "rgba(196, 181, 253, 0.6)",
                  lineHeight: "1.5",
                }}
              >
                Did you forget to add the page to the router or is the path incorrect?
              </p>
            </div>
          </div>

          <Link to="/dashboard">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "inline-block",
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #7c3aed, #e91e8c)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.4)",
              }}
            >
              Back to Dashboard
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

