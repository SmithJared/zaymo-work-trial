// src/components/UrlList.tsx

interface UrlListProps {
  urls: string[];
  status: 'idle' | 'processing' | 'success';
}

export default function UrlList({ urls, status }: UrlListProps) {
  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Extracted URLs</h2>
      {status === 'idle' && <p className="text-gray-500">Please select an HTML file to begin.</p>}
      {status === 'processing' && <p className="text-blue-500">Processing file...</p>}
      {status === 'success' && (
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
