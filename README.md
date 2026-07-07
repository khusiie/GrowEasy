# GrowEasy CSV Importer

An AI-powered CSV Importer built with Next.js, Express, and Google Gemini AI.

## Architecture

This project is stateless. The backend acts as a processing layer that parses the CSV file and intelligently maps the fields using the Gemini API. The frontend displays the parsed data for preview and handles the upload state flow.

## Prerequisites

- Node.js (v18+)
- npm
- Google Gemini API Key

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Set your API Key:
   Open `backend/.env` and replace `your_gemini_api_key_here` with your actual Gemini API Key.
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will be running at `http://localhost:3001`.

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:3000`.

## Features
- **Intelligent Field Mapping**: Extracts fields regardless of messy column headers.
- **Preview UI**: Allows the user to verify data before processing.
- **Glassmorphism UI**: Beautiful, dynamic interface.
- **Multiple Emails/Phones**: Consolidates extras into the CRM notes field.

##  Screenshot 

<img width="680" height="336" alt="{57A1ED46-050A-441E-AA68-84537095C8BF}" src="https://github.com/user-attachments/assets/519f8a0c-6eb4-4363-9bb4-fb1900d18630" />

<img width="1920" height="950" alt="Screenshot from 2026-07-07 21-24-44" src="https://github.com/user-attachments/assets/2c93b1f7-a924-40da-9961-6418d115fb3f" />

<img width="1920" height="950" alt="Screenshot from 2026-07-07 21-24-35" src="https://github.com/user-attachments/assets/03e74354-59a6-41ae-af23-5061715c65b3" />



