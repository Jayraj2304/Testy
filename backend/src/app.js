const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); 

const app = express();
const port = process.env.PORT || 5000; 
const authRoutes = require('./routes/authRoutes');
const githubRoutes = require('./routes/githubRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authMiddleware = require('./middleware/authMiddleware');

app.use(require('cookie-parser')());
app.use(express.json());
app.use(require('cors')({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/github', authMiddleware, githubRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);

// A simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


