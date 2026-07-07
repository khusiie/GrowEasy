import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { processRecordsWithAI } from './src/services/aiService';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const csvData = fs.readFileSync('../test_cases.csv', 'utf-8');
  const records = parse(csvData, { columns: true, skip_empty_lines: true, relax_column_count: true });
  console.log("Parsed Records:", records);
  const result = await processRecordsWithAI(records);
  console.log(JSON.stringify(result, null, 2));
}

run().catch(console.error);
