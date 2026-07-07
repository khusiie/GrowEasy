import { GoogleGenAI, Type, Schema } from '@google/genai';

// Lazy initialization to ensure process.env is fully loaded and throw a clear error if missing
let ai: GoogleGenAI;
const getAiClient = () => {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is missing. ");
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
};

export const processRecordsWithAI = async (records: any[]) => {

  const BATCH_SIZE = 20;
  let allProcessed: any[] = [];

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${i / BATCH_SIZE + 1} / ${Math.ceil(records.length / BATCH_SIZE)}`);

    try {
      const processedBatch = await extractCRMFields(batch);
      allProcessed = [...allProcessed, ...processedBatch];
    } catch (error: any) {
      console.error(`Error processing batch ${i / BATCH_SIZE + 1}:`, error);
      throw new Error(`AI Processing Failed: ${error.message || 'Unknown error'}`);
    }
  }

  const finalRecords = allProcessed.map(record => {
    if (record.status === 'skipped') return record;

    const hasEmail = record.email && record.email.trim() !== '';
    const hasMobile = record.mobile_without_country_code && record.mobile_without_country_code.trim() !== '';

    if (!hasEmail && !hasMobile) {
      return { ...record, status: 'skipped', reason: 'Missing both email and mobile' };
    }

    return { ...record, status: 'success' };
  });

  return { records: finalRecords };
};

const extractCRMFields = async (batch: any[]) => {
  const schema: Schema = {
    type: Type.ARRAY,
    description: "Array of extracted CRM records",
    items: {
      type: Type.OBJECT,
      properties: {
        created_at: { type: Type.STRING, description: "Lead creation date. Must be convertible via new Date(created_at). If missing, leave empty or use a reasonable default if clearly implied." },
        name: { type: Type.STRING, description: "Lead name" },
        email: { type: Type.STRING, description: "Primary email. If multiple, use the first one." },
        country_code: { type: Type.STRING, description: "Country code (e.g. +91, +1). Extract from phone numbers if combined." },
        mobile_without_country_code: { type: Type.STRING, description: "Mobile number without country code. If multiple, use the first one." },
        company: { type: Type.STRING, description: "Company name" },
        city: { type: Type.STRING, description: "City" },
        state: { type: Type.STRING, description: "State" },
        country: { type: Type.STRING, description: "Country" },
        lead_owner: { type: Type.STRING, description: "Lead owner email or name" },
        crm_status: {
          type: Type.STRING,
          description: "Lead status",
          enum: ["GOOD_LEAD_FOLLOW_UP", "DID_NOT_CONNECT", "BAD_LEAD", "SALE_DONE", "UNKNOWN"]
        },
        crm_note: { type: Type.STRING, description: "Notes, remarks, follow-up notes, extra phone numbers, extra emails, or anything that doesn't fit another field. Use '\\n' for new lines if necessary." },
        data_source: {
          type: Type.STRING,
          description: "Source. If none match confidently, leave blank.",
          enum: ["leads_on_demand", "meridian_tower", "eden_park", "varah_swamy", "sarjapur_plots", "UNKNOWN"]
        },
        possession_time: { type: Type.STRING, description: "Property possession time" },
        description: { type: Type.STRING, description: "Additional description" }
      },
      required: [
        "created_at", "name", "email", "country_code", "mobile_without_country_code",
        "company", "city", "state", "country", "lead_owner", "crm_status", "crm_note",
        "data_source", "possession_time", "description"
      ]
    }
  };

  const prompt = `
You are a CRM Data Extraction AI. You will be given a JSON array of messy lead records from a CSV.
Your job is to map and extract information into the exact schema provided.

Rules:
1. Identify the appropriate fields from the messy input. The input columns could be named anything.
2. If multiple email addresses exist, use the first email for 'email' and append the remaining emails into 'crm_note'.
3. If multiple mobile numbers exist, use the first mobile for 'mobile_without_country_code' and append the remaining into 'crm_note'.
4. Ensure 'created_at' is in a standard format parseable by JavaScript's new Date().
5. For 'crm_status' and 'data_source', only use the provided enum values. If unsure, use "UNKNOWN".
6. Replace any literal line breaks with '\\n' to maintain valid formatting.

Input records:
${JSON.stringify(batch, null, 2)}
  `;

  const response = await getAiClient().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.1,
    }
  });

  if (response.text) {
    return JSON.parse(response.text);
  }

  throw new Error("Empty response from AI");
};
