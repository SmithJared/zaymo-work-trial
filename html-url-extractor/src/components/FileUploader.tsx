// src/components/FileUploader.tsx

import { type ChangeEvent } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  fileName: string | null;
}

export default function FileUploader({ onFileSelect, fileName }: FileUploaderProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(event.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
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
    </div>
  );
}
