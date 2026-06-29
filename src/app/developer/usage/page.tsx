export default function UsagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">API Usage</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-2xl font-bold text-gray-900">1,247</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">This Week</p>
          <p className="text-2xl font-bold text-gray-900">8,934</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-2xl font-bold text-gray-900">42,156</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Limit (Free)</p>
          <p className="text-2xl font-bold text-amber-600">100/hr</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Requests by Endpoint</h2>
          <div className="space-y-3">
            {[
              { endpoint: 'GET /api/v1/products', count: 523 },
              { endpoint: 'GET /api/v1/products/:id', count: 312 },
              { endpoint: 'POST /api/v1/cart', count: 198 },
              { endpoint: 'POST /api/v1/orders', count: 145 },
            ].map((item) => (
              <div key={item.endpoint} className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-700">{item.endpoint}</span>
                <span className="text-sm font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Response Status Breakdown</h2>
          <div className="space-y-3">
            {[
              { status: '2xx Success', count: 1156, color: 'bg-green-500' },
              { status: '4xx Client Error', count: 72, color: 'bg-yellow-500' },
              { status: '5xx Server Error', count: 19, color: 'bg-red-500' },
            ].map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{item.status}</span>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${(item.count / 1247) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
