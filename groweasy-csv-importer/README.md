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
