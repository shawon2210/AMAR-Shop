'use client';

import { useState } from 'react';

const mockScore = { score: 92, status: 'EXCELLENT', checks: [
  { name: 'KYC Verification', passed: true, details: 'All active sellers verified' },
  { name: 'AML Screening', passed: true, details: 'No flagged transactions in 30 days' },
  { name: 'PCI DSS Compliance', passed: true, details: 'Card data handled securely' },
  { name: 'GDPR Compliance', passed: true, details: 'Data retention policies active' },
  { name: 'Cookie Consent', passed: false, details: 'Consent logs maintained' },
  { name: 'Data Encryption', passed: true, details: 'AES-256 at rest, TLS 1.3 in transit' },
  { name: 'Age Verification', passed: true, details: 'Restricted products gated' },
  { name: 'Privacy Policy', passed: true, details: 'Privacy center published' },
]};

const kycQueue = [
  { id: 'KY001', name: 'Abdur Rahman', business: 'Tech Haven BD', submitted: '28 Jun 2026', status: 'PENDING' },
  { id: 'KY002', name: 'Fatima Begum', business: 'Fashion Hub', submitted: '27 Jun 2026', status: 'PENDING' },
  { id: 'KY003', name: 'Kamal Hossain', business: 'Gadget Pro', submitted: '26 Jun 2026', status: 'REVIEWING' },
];

const gdprRequests = [
  { id: 'GDPR001', user: 'Sharmin Sultana', type: 'Export', requested: '28 Jun 2026', status: 'PENDING' },
  { id: 'GDPR002', user: 'Nurul Islam', type: 'Delete', requested: '27 Jun 2026', status: 'COMPLETED' },
];

const amlResults = [
  { id: 'AML001', user: 'Test User', risk: 'LOW', score: 5, date: '28 Jun 2026' },
  { id: 'AML002', user: 'High Risk User', risk: 'HIGH', score: 65, date: '27 Jun 2026' },
];

export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'kyc' | 'gdpr' | 'aml' | 'audit'>('overview');
  const [showPolicyEditor, setShowPolicyEditor] = useState(false);
  const [policyContent, setPolicyContent] = useState('AmarShop respects your privacy. We collect minimal data needed to provide our marketplace services.');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: 'dashboard' },
    { id: 'kyc' as const, label: 'KYC Queue', icon: 'verified_user' },
    { id: 'gdpr' as const, label: 'GDPR Requests', icon: 'privacy_tip' },
    { id: 'aml' as const, label: 'AML Screening', icon: 'shield' },
    { id: 'audit' as const, label: 'Audit Log', icon: 'receipt_long' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Compliance Center</h1>
        {showPolicyEditor && (
          <button onClick={() => setShowPolicyEditor(false)} className="text-sm text-primary hover:underline">View Dashboard</button>
        )}
        {!showPolicyEditor && (
          <button onClick={() => setShowPolicyEditor(true)} className="text-sm text-primary hover:underline">Edit Privacy Policy</button>
        )}
      </div>

      <div className="flex gap-1 bg-[#eee] rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-[#666] hover:text-[#333]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {showPolicyEditor ? (
        <div className="bg-white rounded-xl border border-[#eee] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#222]">Privacy Policy Editor</h2>
          <textarea
            value={policyContent}
            onChange={(e) => setPolicyContent(e.target.value)}
            className="w-full h-48 p-4 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 text-sm text-[#666] hover:text-[#333]">Cancel</button>
            <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">Save Policy</button>
          </div>
        </div>
      ) : activeTab === 'overview' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#eee] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#222]">Compliance Score</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  mockScore.status === 'EXCELLENT' ? 'bg-green-100 text-green-700' :
                  mockScore.status === 'GOOD' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {mockScore.status}
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#eee" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#22c55e" strokeWidth="8"
                      strokeDasharray={`${(mockScore.score / 100) * 264} 264`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#222]">
                    {mockScore.score}%
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-[#666]">Overall compliance rating based on 8 security and privacy checks</p>
                  <p className="text-sm font-medium text-[#333]">
                    {mockScore.checks.filter(c => c.passed).length}/{mockScore.checks.length} checks passed
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#eee] p-6">
              <h2 className="text-lg font-semibold text-[#222] mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-left">
                  <span className="material-symbols-outlined text-amber-600">verified_user</span>
                  <div><p className="text-sm font-medium text-amber-800">Review KYC</p><p className="text-xs text-amber-600">2 pending verifications</p></div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 text-left">
                  <span className="material-symbols-outlined text-blue-600">privacy_tip</span>
                  <div><p className="text-sm font-medium text-blue-800">GDPR Requests</p><p className="text-xs text-blue-600">1 pending export request</p></div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 text-left">
                  <span className="material-symbols-outlined text-green-600">shield</span>
                  <div><p className="text-sm font-medium text-green-800">PCI DSS</p><p className="text-xs text-green-600">All 12 requirements met</p></div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#eee] p-6">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Compliance Checklist</h2>
            <div className="space-y-3">
              {mockScore.checks.map((check) => (
                <div key={check.name} className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${check.passed ? 'text-green-500' : 'text-amber-500'}`}>
                      {check.passed ? 'check_circle' : 'warning'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#333]">{check.name}</p>
                      <p className="text-xs text-[#888]">{check.details}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    check.passed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>{check.passed ? 'PASS' : 'FAIL'}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : activeTab === 'kyc' ? (
        <div className="bg-white rounded-xl border border-[#eee]">
          <div className="p-5 border-b border-[#eee]">
            <h2 className="text-lg font-semibold text-[#222]">KYC Verification Queue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[#888] text-xs uppercase tracking-wider border-b border-[#eee]">
                <th className="p-3">ID</th><th className="p-3">Name</th><th className="p-3">Business</th>
                <th className="p-3">Submitted</th><th className="p-3">Status</th><th className="p-3">Actions</th>
              </tr></thead>
              <tbody>
                {kycQueue.map((k) => (
                  <tr key={k.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{k.id}</td>
                    <td className="p-3 text-[#555]">{k.name}</td>
                    <td className="p-3 text-[#555]">{k.business}</td>
                    <td className="p-3 text-[#888]">{k.submitted}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        k.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>{k.status}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Approve</button>
                        <button className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'gdpr' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#eee]">
            <div className="p-5 border-b border-[#eee]">
              <h2 className="text-lg font-semibold text-[#222]">Data Requests</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-[#888] text-xs uppercase tracking-wider border-b border-[#eee]">
                  <th className="p-3">ID</th><th className="p-3">User</th><th className="p-3">Type</th>
                  <th className="p-3">Date</th><th className="p-3">Status</th>
                </tr></thead>
                <tbody>
                  {gdprRequests.map((g) => (
                    <tr key={g.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                      <td className="p-3 font-medium text-[#333]">{g.id}</td>
                      <td className="p-3 text-[#555]">{g.user}</td>
                      <td className="p-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          g.type === 'Export' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>{g.type}</span>
                      </td>
                      <td className="p-3 text-[#888]">{g.requested}</td>
                      <td className="p-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          g.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>{g.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#eee] p-6">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Cookie Consent Configuration</h2>
            <div className="space-y-4">
              {[
                { name: 'Necessary', desc: 'Essential for site operation', enabled: true, required: true },
                { name: 'Functional', desc: 'Remember preferences', enabled: true, required: false },
                { name: 'Analytics', desc: 'Usage tracking', enabled: false, required: false },
                { name: 'Marketing', desc: 'Personalized ads', enabled: false, required: false },
              ].map((c) => (
                <div key={c.name} className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-[#333]">{c.name}</p>
                    <p className="text-xs text-[#888]">{c.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={c.enabled} onChange={() => {}} disabled={c.required}
                      className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#ccc] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              ))}
              <button className="w-full mt-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Save Configuration</button>
            </div>
          </div>
        </div>
      ) : activeTab === 'aml' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#eee] p-6">
            <h2 className="text-lg font-semibold text-[#222] mb-4">AML Screening Results</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-[#888] text-xs uppercase tracking-wider border-b border-[#eee]">
                  <th className="p-3">ID</th><th className="p-3">User</th><th className="p-3">Risk</th>
                  <th className="p-3">Score</th><th className="p-3">Date</th><th className="p-3">Actions</th>
                </tr></thead>
                <tbody>
                  {amlResults.map((a) => (
                    <tr key={a.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                      <td className="p-3 font-medium text-[#333]">{a.id}</td>
                      <td className="p-3 text-[#555]">{a.user}</td>
                      <td className="p-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          a.risk === 'LOW' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>{a.risk}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#eee] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${a.score > 50 ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${a.score}%` }} />
                          </div>
                          <span className="text-[#666]">{a.score}</span>
                        </div>
                      </td>
                      <td className="p-3 text-[#888]">{a.date}</td>
                      <td className="p-3">
                        <button className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary/90">Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] p-6">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Audit Log</h2>
          <p className="text-sm text-[#888]">Comprehensive audit trail of all compliance-related actions.</p>
        </div>
      )}
    </div>
  );
}
