import { Router } from 'express';
import multer from 'multer';
import { parse } from 'csv-parse';
import { processRecordsWithAI } from '../services/aiService';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res): Promise<any> => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const csvData = req.file.buffer.toString('utf-8');

    // Parse CSV
    const records: any[] = await new Promise((resolve, reject) => {
      parse(csvData, { columns: true, skip_empty_lines: true, relax_column_count: true }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    if (records.length === 0) {
      return res.status(400).json({ error: 'The uploaded CSV file is empty.' });
    }

    // Process with AI
    const result = await processRecordsWithAI(records);

    return res.json({
      success: true,
      data: result.records,
      stats: {
        total: records.length,
        imported: result.records.filter((r: any) => r.status === 'success').length,
        skipped: result.records.filter((r: any) => r.status === 'skipped').length,
      }
    });

  } catch (error: any) {
    console.error('Error processing upload:', error);
    return res.status(500).json({ error: error.message || 'Failed to process file' });
  }
});

export default router;
