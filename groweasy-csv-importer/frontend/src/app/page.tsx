'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import CsvUploader from '../components/CsvUploader';
import DataTable from '../components/DataTable';
import StatusLegend from '../components/StatusLegend';

import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

type AppState = 'UPLOAD' | 'PREVIEW' | 'PROCESSING' | 'RESULT';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('UPLOAD');
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewColumns, setPreviewColumns] = useState<string[]>([]);

  const [resultData, setResultData] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, imported: 0, skipped: 0 });
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setError(null);

    // Parse for preview
    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setPreviewData(results.data.slice(0, 10)); // Show top 10 for preview
          setPreviewColumns(Object.keys(results.data[0] as object));
          setAppState('PREVIEW');
        } else {
          setError("The CSV file appears to be empty or invalid.");
        }
      },
      error: (err) => {
        setError("Error parsing CSV: " + err.message);
      }
    });
  };

  const handleConfirmImport = () => {
    if (!file) return;
    setAppState('PROCESSING');
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    const rawBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://crm-eduj.vercel.app';
    const backendUrl = rawBackendUrl.endsWith('/') ? rawBackendUrl.slice(0, -1) : rawBackendUrl;
    fetch(`${backendUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Failed to process file');
        }
        setResultData(result.data);
        setStats(result.stats);
        setAppState('RESULT');
      })
      .catch((err: any) => {
        setError(err.message || "An unexpected error occurred.");
        setAppState('PREVIEW'); // Go back to preview on error
      });
  };

  const handleReset = () => {
    setFile(null);
    setPreviewData([]);
    setPreviewColumns([]);
    setResultData([]);
    setStats({ total: 0, imported: 0, skipped: 0 });
    setError(null);
    setAppState('UPLOAD');
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden flex flex-col items-center">
      {/* Decorative Background Semicircles */}


      <div className="container w-full mx-auto px-4 py-12 flex flex-col items-center relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-success tracking-tight">
            GrowEasy CRM AI Importer
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Intelligently extract and map your messy lead data into structured CRM format.
          </p>
        </div>

        {error && (
          <div className="w-full max-w-3xl glass-panel border-error/50 bg-error/10 text-error px-6 py-4 rounded-lg mb-8 text-center font-medium shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            {error}
          </div>
        )}

        {appState === 'UPLOAD' && (
          <div className="w-full max-w-3xl animate-fade-in-up">
            <CsvUploader onFileUpload={handleFileUpload} />
          </div>
        )}

        {appState === 'PREVIEW' && (
          <div className="w-full animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 glass-panel px-6 py-4">
              <h2 className="text-2xl font-bold mb-4 md:mb-0">Preview Data <span className="text-text-secondary text-sm font-normal ml-2">(Top 10 Rows)</span></h2>
              <div className="flex gap-4">
                <button type="button" className="button-secondary" onClick={handleReset}>Cancel</button>
                <button type="button" className="button-primary" onClick={handleConfirmImport}>
                  Confirm & Import with AI <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <DataTable data={previewData} columns={previewColumns} />
          </div>
        )}

        {appState === 'PROCESSING' && (
          <div className="w-full max-w-2xl mx-auto glass-panel p-12 text-center animate-zoom-in">
            <div className="inline-block relative w-20 h-20 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-glass-border border-t-accent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-glass-border border-b-success animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-success animate-pulse">
              AI is processing your leads...
            </h2>
            <p className="text-text-secondary text-lg">
              This might take a few moments depending on the file size. Relax while we do the heavy lifting!
            </p>
          </div>
        )}

        {appState === 'RESULT' && (
          <div className="w-full animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 glass-panel px-6 py-4">
              <h2 className="text-2xl font-bold text-success flex items-center gap-2">
                <CheckCircle2 size={28} />
                Import Results
              </h2>
              <button type="button" className="button-primary mt-4 md:mt-0" onClick={handleReset}>
                <RotateCcw size={18} /> Import Another File
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-panel p-6 text-center flex flex-col items-center justify-center transform transition-transform hover:scale-105">
                <span className="text-text-secondary text-sm uppercase tracking-wider mb-2">Total Rows</span>
                <strong className="text-4xl font-black text-text-primary">{stats.total}</strong>
              </div>
              <div className="glass-panel border-success/30 p-6 text-center flex flex-col items-center justify-center relative overflow-hidden transform transition-transform hover:scale-105">
                <div className="absolute inset-0 bg-success/5 pointer-events-none"></div>
                <span className="text-success text-sm uppercase tracking-wider mb-2 flex items-center gap-1">
                  <CheckCircle2 size={16} /> Successfully Imported
                </span>
                <strong className="text-5xl font-black text-success">{stats.imported}</strong>
              </div>
              <div className="glass-panel border-error/30 p-6 text-center flex flex-col items-center justify-center relative overflow-hidden transform transition-transform hover:scale-105">
                <div className="absolute inset-0 bg-error/5 pointer-events-none"></div>
                <span className="text-error text-sm uppercase tracking-wider mb-2">Skipped (Invalid/Missing)</span>
                <strong className="text-4xl font-black text-error">{stats.skipped}</strong>
              </div>
            </div>

            <StatusLegend data={resultData} />

            <div className="">
              <DataTable
                data={resultData}
                columns={['status', 'name', 'email', 'country_code', 'mobile_without_country_code', 'company', 'city', 'state', 'country', 'lead_owner', 'crm_status', 'crm_note', 'data_source']}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
