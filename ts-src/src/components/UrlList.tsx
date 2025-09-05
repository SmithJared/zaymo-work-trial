// src/components/UrlList.tsx

interface ShortenedUrl {
  long_url: string;
  short_url: string;
}

interface UrlListProps {
  urls: string[];
  shortenedUrls: ShortenedUrl[];
  status: 'idle' | 'processing' | 'success' | 'shortening' | 'shortened';
  error: string | null;
  modifiedHtml: string;
  fileName: string | null;
}

export default function UrlList({ urls, shortenedUrls, status, error, modifiedHtml, fileName }: UrlListProps) {
  const downloadModifiedHtml = () => {
    if (!modifiedHtml || !fileName) return;
    
    const blob = new Blob([modifiedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Create new filename with '_shortened' suffix
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    const extension = fileName.includes('.') ? fileName.split('.').pop() : 'html';
    link.download = `${nameWithoutExt}_shortened.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {status === 'shortened' ? 'Shortened URLs' : 'Extracted URLs'}
      </h2>
      
      {status === 'idle' && <p className="text-gray-500">Please select an HTML file to begin.</p>}
      {status === 'processing' && <p className="text-blue-500">Processing file...</p>}
      {status === 'shortening' && (
        <div className="flex items-center text-blue-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          <p>Shortening URLs...</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">⚠️ {error}</p>
          <p className="text-red-500 text-xs mt-1">Showing original URLs below:</p>
        </div>
      )}
      
      {status === 'shortened' && shortenedUrls.length > 0 && (
        <>
          <div className="space-y-3 mb-6">
            {shortenedUrls.map((item, index) => (
              <div key={`${item.long_url}-${index}`} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                <div className="mb-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Short URL:</label>
                  <div className="flex items-center mt-1">
                    <code className="text-sm font-mono text-blue-600 bg-white px-2 py-1 rounded border flex-1">
                      {item.short_url}
                    </code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(item.short_url)}
                      className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Original URL:</label>
                  <p className="text-sm text-gray-700 mt-1 break-all">{item.long_url}</p>
                </div>
              </div>
            ))}
          </div>
          
          {modifiedHtml && (
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-green-800">HTML File Ready!</h3>
                </div>
                <p className="text-green-700 text-sm mb-4">
                  All {shortenedUrls.length} URLs in your HTML file have been replaced with shortened versions.
                </p>
                <button
                  onClick={downloadModifiedHtml}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Modified HTML
                </button>
              </div>
            </div>
          )}
        </>
      )}
      
      {(status === 'success' || (status === 'shortened' && error)) && (
        urls.length > 0 ? (
          <pre className="bg-gray-50 p-4 rounded-md max-h-96 overflow-auto text-sm">
            {urls.join('\n')}
          </pre>
        ) : (
          <p className="text-gray-500">No absolute URLs (starting with http/https) were found.</p>
        )
      )}
    </div>
  );
}
