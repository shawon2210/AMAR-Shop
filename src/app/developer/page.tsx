export default function DeveloperOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Developer Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">API Keys</p>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-xs text-green-600 mt-1">2 active</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">API Calls Today</p>
          <p className="text-3xl font-bold text-gray-900">1,247</p>
          <p className="text-xs text-gray-500 mt-1">+12% from yesterday</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Webhooks</p>
          <p className="text-3xl font-bold text-gray-900">5</p>
          <p className="text-xs text-green-600 mt-1">All active</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent API Activity</h2>
        <div className="text-sm text-gray-500">No recent activity</div>
      </div>
    </div>
  );
}
