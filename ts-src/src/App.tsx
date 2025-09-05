// src/App.tsx

import { useState } from 'react';
import FileUploader from './components/FileUploader';
import UrlList from './components/UrlList';

type Status = 'idle' | 'processing' | 'success' | 'shortening' | 'shortened';

interface ShortenedUrl {
  long_url: string;
  short_url: string;
}

function App() {
  const [urls, setUrls] = useState<string[]>([]);
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const extractCssUrls = (cssText: string): string[] => {
    const urls: string[] = [];
    
    // Regular expression to match url() functions in CSS
    // Matches: url("..."), url('...'), url(...)
    const urlRegex = /url\(\s*["']?([^"'\)\s]+)["']?\s*\)/gi;
    
    let match;
    while ((match = urlRegex.exec(cssText)) !== null) {
      const url = match[1];
      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        urls.push(url);
      }
    }
    
    return urls;
  };

  const shortenUrls = async (urlsToShorten: string[]) => {
    if (urlsToShorten.length === 0) {
      setStatus('success');
      return;
    }

    setStatus('shortening');
    setError(null);

    try {
      // TODO: Make this configurable - for now assuming backend runs on localhost:8080
      const response = await fetch('http://localhost:8080/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: urlsToShorten
        })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Backend now returns array of ShortenedURL objects directly
      setShortenedUrls(data.shortened || []);
      setStatus('shortened');
    } catch (err) {
      console.error('Error shortening URLs:', err);
      setError(err instanceof Error ? err.message : 'Failed to shorten URLs');
      setStatus('success'); // Fall back to showing original URLs
    }
  };

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
        
        // Extract URLs from HTML attributes
        doc.querySelectorAll('a[href], link[href], img[src], script[src]').forEach(el => {
          const url = el.getAttribute('href') || el.getAttribute('src');
          if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            uniqueUrls.add(url);
          }
        });

        // Extract URLs from inline CSS in <style> tags
        doc.querySelectorAll('style').forEach(styleEl => {
          const cssText = styleEl.textContent || '';
          const cssUrls = extractCssUrls(cssText);
          cssUrls.forEach(url => uniqueUrls.add(url));
        });

        // Extract URLs from style attributes
        doc.querySelectorAll('[style]').forEach(el => {
          const styleAttr = el.getAttribute('style') || '';
          const cssUrls = extractCssUrls(styleAttr);
          cssUrls.forEach(url => uniqueUrls.add(url));
        });

        // Also search for CSS URLs in the raw HTML content
        // This catches cases where CSS might be in comments or other contexts
        const rawCssUrls = extractCssUrls(content);
        rawCssUrls.forEach(url => uniqueUrls.add(url));

        const extractedUrls = Array.from(uniqueUrls).sort();
        setUrls(extractedUrls);
        setStatus('success');
        
        // Automatically send URLs to backend for shortening
        if (extractedUrls.length > 0) {
          shortenUrls(extractedUrls);
        }
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
      <UrlList 
        urls={urls} 
        shortenedUrls={shortenedUrls}
        status={status} 
        error={error}
      />
    </main>
  );
}

export default App;
