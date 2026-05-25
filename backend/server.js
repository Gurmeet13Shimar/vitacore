const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/db');

dotenv.config();

/* CONNECT DATABASE */
connectDB();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ROUTES */
/* ROUTES */
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const financeRoutes = require('./routes/financeRoutes');
const careerRoutes = require('./routes/careerRoutes');

/* APIs */
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/career', careerRoutes);

/* ROOT ROUTE */
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running!',
  });
});

/* SERVER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});