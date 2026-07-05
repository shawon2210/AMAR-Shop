'use client';

import { useState } from 'react';

export default function PlaygroundPage() {
  const [endpoint, setEndpoint] = useState('/api/v1/products');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    setResponse('Sending request...');
    try {
      const res = await fetch(endpoint, { method });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      const error = err as Error | undefined;
      setResponse(`Error: ${error?.message ?? String(err)}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">API Playground</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-3 mb-4">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button onClick={handleSend} className="px-6 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">Send</button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-400">Response</h2>
          <button onClick={() => setResponse('')} className="text-xs text-gray-500 hover:text-white">Clear</button>
        </div>
        <pre className="text-sm font-mono text-green-400 overflow-auto max-h-96 whitespace-pre-wrap">
          {response || 'Click Send to see the response...'}
        </pre>
      </div>
    </div>
  );
}
