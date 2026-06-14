const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');
const cron = require('node-cron');
const { spawn } = require('child_process');
const path = require('path');

// Load .env file
dotenv.config({ path: './.env', override: true });
console.log("CALORIE_NINJAS_KEY =", process.env.CALORIE_NINJAS_KEY);
console.log("Loaded OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY);

// Force Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

// ── Auto-spawn FastAPI (uvicorn) ML service ───────────────────────────────────
function spawnFastAPI() {
  const backendDir = path.join(__dirname);
  const proc = spawn('python', ['-m', 'uvicorn', 'simulation:app', '--host', '127.0.0.1', '--port', '8000'], {
    cwd: backendDir,
    shell: true,
  });

  proc.stdout.on('data', (d) => process.stdout.write(`[FastAPI] ${d}`));
  proc.stderr.on('data', (d) => process.stderr.write(`[FastAPI] ${d}`));

  proc.on('close', (code) => {
    console.warn(`[FastAPI] Process exited (code ${code}). Restarting in 3s...`);
    setTimeout(spawnFastAPI, 3000);
  });

  proc.on('error', (err) => {
    console.error('[FastAPI] Failed to start:', err.message);
    setTimeout(spawnFastAPI, 5000);
  });

  console.log('[FastAPI] ML service spawned on http://127.0.0.1:8000 ✅');
}

spawnFastAPI();

const app = express();
const httpServer = http.createServer(app);

// ── Initialize Socket.IO (must happen before routes) ─────────────────────────
const { initIO } = require('./config/socket');
initIO(httpServer);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Check env values
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Loaded" : "Missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Missing");
console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? "Loaded" : "Missing");

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const healthRoutes = require('./routes/healthRoutes');
const financeRoutes = require('./routes/financeRoutes');
const careerRoutes = require('./routes/careerRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const goalRoutes = require('./routes/goalRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/goals', goalRoutes);

console.log('Novu Secret Key:', process.env.NOVU_SECRET_KEY ? 'Loaded ✅' : 'Missing ❌');

// ── MongoDB connection ────────────────────────────────────────────────────────
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB ✅');

      // ── Daily AI Report Cron (runs every day at midnight) ─────────────────
      cron.schedule('0 0 * * *', async () => {
        console.log('[Cron] Running daily summary notification job...');
        try {
          const User = require('./models/User');
          const { createNotification } = require('./services/notificationService');
          const users = await User.find({}, '_id name').lean();

          const results = await Promise.allSettled(
            users.map((u) =>
              createNotification(
                u._id.toString(),
                '📊 Your Daily VitaCore Summary',
                `Good morning ${u.name || 'there'}! Check your dashboard for today's health, finance, and career insights. Stay on track and keep growing! 🚀`,
                'system',
                'low'
              )
            )
          );

          const sent = results.filter((r) => r.status === 'fulfilled').length;
          console.log(`[Cron] Daily summary sent to ${sent}/${users.length} users`);
        } catch (err) {
          console.error('[Cron] Daily summary job failed:', err.message);
        }
      }, { timezone: 'Asia/Kolkata' });

      console.log('[Cron] Daily summary job scheduled at midnight IST ✅');
    })
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('MONGODB_URI missing');
}

// ── Start server ──────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});