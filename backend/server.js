const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');

// Force Google DNS to bypass ISP blocking of MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const healthRoutes = require('./routes/healthRoutes');
const financeRoutes = require('./routes/financeRoutes');
const careerRoutes = require('./routes/careerRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/career', careerRoutes);

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('Skipping MongoDB connection: MONGODB_URI not provided.');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
