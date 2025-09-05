// src/App.tsx

import { useState } from 'react';
import FileUploader from './components/FileUploader';
import UrlList from './components/UrlList';

type Status = 'idle' | 'processing' | 'success';

function App() {
  const [urls, setUrls] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const handleFileSelect = (file: File) => {
    setStatus('processing');
    setFileName(file.name);
    setUrls([]);

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const uniqueUrls = new Set<string>();
        
        doc.querySelectorAll('a[href], link[href], img[src], script[src]').forEach(el => {
          const url = el.getAttribute('href') || el.getAttribute('src');
          if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            uniqueUrls.add(url);
          }
        });

        setUrls(Array.from(uniqueUrls).sort());
        setStatus('success');
      }
    };

    reader.readAsText(file);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">HTML URL Extractor</h1>
        <p className="text-lg text-gray-600 mt-2">Upload an HTML file to extract all of its URLs.</p>
      </div>

      <FileUploader onFileSelect={handleFileSelect} fileName={fileName} />
      <UrlList urls={urls} status={status} />
    </main>
  );
}

export default App;
