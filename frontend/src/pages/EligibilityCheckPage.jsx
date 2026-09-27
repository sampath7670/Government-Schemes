import React, { useState, useEffect } from 'react';
import { checkEligibility } from '../services/api';
import SchemeCard from '../components/SchemeCard';
import { UserCheck, AlertCircle, CheckCircle2, HelpCircle, XCircle, Sliders, Loader2, Sparkles } from 'lucide-react';

export default function EligibilityCheckPage({ currentProfile, onOpenProfileModal, onAskAI }) {
  const [eligibilityData, setEligibilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('potentially_relevant');

  useEffect(() => {
    runEligibilityCheck();
  }, [currentProfile]);

  const runEligibilityCheck = async () => {
    setLoading(true);
    try {
      const data = await checkEligibility(currentProfile);
      setEligibilityData(data);
    } catch (err) {
      console.error("Error evaluating eligibility:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              Automated Profile Matching Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Eligibility Match Assessment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluating criteria against profile: <strong className="text-slate-800">{currentProfile.class_name || 'Class 10'}</strong>, State: <strong className="text-slate-800">{currentProfile.state}</strong>, Category: <strong className="text-slate-800">{currentProfile.category}</strong>, Income: <strong className="text-slate-800">₹{currentProfile.annual_income?.toLocaleString('en-IN')}</strong>
          </p>
        </div>

        <button
          onClick={onOpenProfileModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition-colors shadow-xs"
        >
          <Sliders className="w-4 h-4" />
          Edit Student Profile
        </button>
      </div>

      {/* Strict Disclaimer Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900 shadow-xs">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Official Guidance Rule:</strong>
          <p className="mt-0.5 leading-relaxed">
            "Based on the information you provided, you may meet the listed criteria. Final eligibility is determined by the relevant authority."
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-900 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Running profile matching algorithm across Central & State schemes...</p>
        </div>
      ) : eligibilityData ? (
        <div className="space-y-6">
          {/* Classification Tabs */}
          <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('potentially_relevant')}
              className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'potentially_relevant'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Potentially Relevant ({eligibilityData.potentially_relevant.length})
            </button>

            <button
              onClick={() => setActiveTab('more_info_required')}
              className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'more_info_required'
                  ? 'border-amber-600 text-amber-700 bg-amber-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              More Info Required ({eligibilityData.more_info_required.length})
            </button>

            <button
              onClick={() => setActiveTab('not_matching')}
              className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'not_matching'
                  ? 'border-red-600 text-red-700 bg-red-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <XCircle className="w-4 h-4 text-red-600" />
              Not Matching ({eligibilityData.not_matching.length})
            </button>
          </div>

          {/* Results List */}
          {activeTab === 'potentially_relevant' && (
            <div className="space-y-4">
              {eligibilityData.potentially_relevant.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                  No schemes matched all profile parameters perfectly. Check "More Info Required" or edit your profile.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {eligibilityData.potentially_relevant.map((item) => (
                    <div key={item.scheme.scheme_id} className="space-y-2">
                      <SchemeCard scheme={item.scheme} onAskAI={onAskAI} isPotentiallyRelevant={true} />
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-[11px] text-emerald-900 space-y-1">
                        <span className="font-bold block">Why it may be relevant:</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {item.matching_reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'more_info_required' && (
            <div className="space-y-4">
              {eligibilityData.more_info_required.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                  No schemes require additional information.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {eligibilityData.more_info_required.map((item) => (
                    <div key={item.scheme.scheme_id} className="space-y-2">
                      <SchemeCard scheme={item.scheme} onAskAI={onAskAI} />
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-900 space-y-1">
                        <span className="font-bold block">Missing profile information:</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {item.missing_information.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'not_matching' && (
            <div className="space-y-4">
              {eligibilityData.not_matching.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                  No schemes were explicitly conflicting.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {eligibilityData.not_matching.map((item) => (
                    <div key={item.scheme.scheme_id} className="space-y-2 opacity-85 hover:opacity-100 transition-opacity">
                      <SchemeCard scheme={item.scheme} onAskAI={onAskAI} />
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-[11px] text-red-900 space-y-1">
                        <span className="font-bold block">Eligibility conflict reason:</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {item.conflicts.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
