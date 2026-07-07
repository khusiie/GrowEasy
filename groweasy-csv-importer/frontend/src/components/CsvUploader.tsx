import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface CsvUploaderProps {
  onFileUpload: (file: File) => void;
}

export default function CsvUploader({ onFileUpload }: CsvUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`glass-panel flex flex-col items-center justify-center py-16 px-8 border-2 border-dashed cursor-pointer text-center mx-auto max-w-[600px] transition-all duration-300 hover:border-accent hover:bg-accent/5 group ${isDragActive ? 'border-success bg-success/5' : isDragReject ? 'border-error bg-error/5' : 'border-glass-border'
        }`}
    >
      <input {...getInputProps()} />
      <div className="bg-white/10 p-6 rounded-full mb-6 text-accent transition-transform duration-300 group-hover:scale-110">
        <UploadCloud size={48} className='text-white
        '/>
      </div>
      <h3 className="text-2xl font-semibold mb-2">
        {isDragActive ? 'Drop your CSV here' : 'Drag & Drop your CSV file'}
      </h3>
      <p className="text-text-secondary text-lg mb-4">
        or click to browse your computer
      </p>
      <p className="text-warning text-sm font-medium mt-4">
        Supports any valid CSV layout. AI will automatically map the fields.
      </p>

      <div className="mt-8 border-t border-glass-border pt-6 w-full">
        <p className="text-xs text-text-secondary mb-3 font-medium uppercase tracking-wider text-center">
          Target CRM Fields
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {['Created At', 'Name', 'Email', 'Country Code', 'Mobile', 'Company', 'City', 'State', 'Country', 'Lead Owner', 'CRM Status', 'Note', 'Data Source', 'Possession Time', 'Description'].map(field => (
            <span key={field} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-text-secondary">
              {field}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
