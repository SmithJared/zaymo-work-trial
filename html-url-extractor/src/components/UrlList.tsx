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
}

export default function UrlList({ urls, shortenedUrls, status, error }: UrlListProps) {
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
        <div className="space-y-3">
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
