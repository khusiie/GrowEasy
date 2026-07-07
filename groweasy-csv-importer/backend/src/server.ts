import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import uploadRouter from './routes/upload';

const app = express();
const port = process.env.PORT || 5001;

// Allowed origins list for CORS
app.use(cors());
app.use(express.json());

app.use('/api/upload', uploadRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
