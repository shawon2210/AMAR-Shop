export default function DocsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">API Documentation</h1>

      <div className="space-y-6">
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Authentication</h2>
          <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-green-400 mb-3">
            <p># All API requests require authentication via Bearer token or API key</p>
            <p>Authorization: Bearer &lt;jwt_token&gt;</p>
            <p># Or use API key:</p>
            <p>X-API-Key: amarshop_&lt;your_api_key&gt;</p>
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Endpoints</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                <span className="font-mono text-sm text-gray-700">/api/v1/products</span>
              </div>
              <p className="text-sm text-gray-500 ml-14">List all products with optional filters</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">POST</span>
                <span className="font-mono text-sm text-gray-700">/api/v1/orders</span>
              </div>
              <p className="text-sm text-gray-500 ml-14">Create a new order</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">PUT</span>
                <span className="font-mono text-sm text-gray-700">/api/v1/cart</span>
              </div>
              <p className="text-sm text-gray-500 ml-14">Update cart items</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Rate Limits</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong className="text-gray-900">Free:</strong> 100 requests/hour</p>
            <p><strong className="text-gray-900">Pro:</strong> 10,000 requests/hour</p>
            <p><strong className="text-gray-900">Enterprise:</strong> Unlimited</p>
          </div>
        </section>
      </div>
    </div>
  );
}
