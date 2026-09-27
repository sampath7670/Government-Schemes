import React, { useState, useEffect } from 'react';
import { fetchSources } from '../services/api';
import { FileText, ExternalLink, CheckCircle2, AlertCircle, Building2, Calendar, ShieldCheck, Loader2 } from 'lucide-react';

export default function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSourcesData();
  }, []);

  const loadSourcesData = async () => {
    setLoading(true);
    try {
      const data = await fetchSources();
      setSources(data);
    } catch (err) {
      console.error("Error loading sources:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Citation Registry
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Official Government Sources & Verification Register
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Every scheme in this database is catalogued with its verified official government portal URL, notification document source, academic year, and last verified timestamp.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-900 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Fetching official source register...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Scheme & Jurisdiction</th>
                  <th className="px-4 py-3">Department & Source Title</th>
                  <th className="px-4 py-3">Academic Year</th>
                  <th className="px-4 py-3">Last Verified</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Official Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sources.map((src) => (
                  <tr key={src.scheme_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      <div>{src.scheme_name}</div>
                      <span className="text-[10px] font-semibold text-slate-500">{src.government_level} ({src.state})</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="font-semibold text-slate-800">{src.source_title || 'Government Portal'}</div>
                      <div className="text-[10px] text-slate-400">{src.department}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{src.academic_year}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{src.last_verified}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        src.verification_status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {src.verification_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <a
                        href={src.official_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-blue-900 hover:underline"
                      >
                        Portal Link
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {src.official_document_url && (
                        <a
                          href={src.official_document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-indigo-700 hover:underline"
                        >
                          PDF Guidelines
                          <FileText className="w-3 h-3" />
                        </a>
                      )}
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
