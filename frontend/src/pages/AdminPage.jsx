import React, { useState, useEffect } from 'react';
import { fetchSchemes } from '../services/api';
import { Settings, ShieldCheck, CheckCircle2, AlertCircle, Plus, RefreshCw, Building2, Calendar, Edit3, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const data = await fetchSchemes();
      setSchemes(data);
    } catch (err) {
      console.error("Error loading admin schemes:", err);
    } finally {
      setLoading(false);
    }
  };

  const verifiedCount = schemes.filter(s => s.verification_status === 'Verified').length;
  const needsVerificationCount = schemes.filter(s => s.verification_status === 'Needs Verification').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-800 text-blue-100 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              Administrative Verification Desk
            </span>
          </div>
          <h1 className="text-2xl font-extrabold">Government Schemes Verification Admin</h1>
          <p className="text-slate-400 text-xs mt-1">
            Audit official sources, update verification status, academic years, and manage candidate schemes.
          </p>
        </div>

        <button
          onClick={loadSchemes}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Database
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Database Records</span>
          <span className="text-3xl font-extrabold text-slate-900 mt-1 block">{schemes.length}</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Verified Schemes</span>
          <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">{verifiedCount}</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Needs Verification</span>
          <span className="text-3xl font-extrabold text-amber-600 mt-1 block">{needsVerificationCount}</span>
        </div>
      </div>

      {/* Database Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-900 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading admin records...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-900 text-sm">Scheme Verification Registry</h2>
            <span className="text-xs text-slate-500 font-medium">Strict Verification Status Protocol Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">ID & Scheme Name</th>
                  <th className="px-4 py-3">Jurisdiction</th>
                  <th className="px-4 py-3">Education Level</th>
                  <th className="px-4 py-3">Academic Year</th>
                  <th className="px-4 py-3">Last Verified</th>
                  <th className="px-4 py-3">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemes.map((s) => (
                  <tr key={s.scheme_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      <div className="text-blue-900 font-mono text-[11px]">{s.scheme_id}</div>
                      <div>{s.scheme_name}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{s.government_level} ({s.state})</td>
                    <td className="px-4 py-3">{s.education_level.join(', ')}</td>
                    <td className="px-4 py-3 font-semibold">{s.academic_year}</td>
                    <td className="px-4 py-3">{s.last_verified}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.verification_status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {s.verification_status === 'Verified' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-amber-600" />}
                        {s.verification_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
