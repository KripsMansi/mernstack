import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './database.js';
import bookRoutes from './routes/book.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/mysite', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/mysite', bookRoutes);
app.get('/mysite/health', (req, res) => {
  res.json({ status: 'ok' });
});

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
