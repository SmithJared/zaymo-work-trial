// src/components/FileUploader.tsx

import { type ChangeEvent, type DragEvent, useState } from 'react';
import { toast } from 'sonner';

interface ShortenedUrl {
  long_url: string;
  short_url: string;
}
interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  fileName: string | null;
  status: 'idle' | 'processing' | 'success' | 'shortening' | 'shortened';
  modifiedHtml: string;
  shortenedUrls: ShortenedUrl[];
}

export default function FileUploader({ onFileSelect, fileName, status, modifiedHtml, shortenedUrls }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if it's an HTML file
      if (file.type === 'text/html' || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        onFileSelect(file);
      } else {
        alert('Please select an HTML file (.html or .htm)');
      }
    }
  };

  const downloadModifiedHtml = () => {
    if (!modifiedHtml || !fileName) return;
    
    const blob = new Blob([modifiedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Create new filename with '_shortened' suffix
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    const extension = fileName.includes('.') ? fileName.split('.').pop() : 'html';
    const downloadFileName = `${nameWithoutExt}_shortened.${extension}`;
    link.download = downloadFileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded ${downloadFileName}`);
  };

  return (
    <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">HTML files only (.html, .htm)</p>
        </div>
        <input id="file-upload" type="file" className="hidden" accept=".html,.htm" onChange={handleFileChange} />
      </label>
      {fileName && (
        <p className="mt-4 text-center text-sm text-green-600 font-medium">
          File selected: {fileName}
        </p>
      )} 
       {status === 'shortened' && shortenedUrls.length > 0 && modifiedHtml && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={downloadModifiedHtml}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Shortened HTML
          </button>
        </div>
      )}
    </div>
  );
}
