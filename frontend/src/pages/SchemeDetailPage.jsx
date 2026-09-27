import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSchemeById } from '../services/api';
import { ArrowLeft, CheckCircle2, AlertCircle, ExternalLink, Calendar, Building2, Award, FileText, UserCheck, HelpCircle, Loader2 } from 'lucide-react';

export default function SchemeDetailPage({ onAskAI }) {
  const { schemeId } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSchemeDetails();
  }, [schemeId]);

  const loadSchemeDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchSchemeById(schemeId);
      setScheme(data);
    } catch (err) {
      console.error("Error fetching scheme details:", err);
      setError("Scheme details could not be loaded or scheme ID is invalid.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-900 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading scheme information...</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">{error || 'Scheme Not Found'}</h2>
        <Link to="/schemes" className="inline-block px-4 py-2 bg-blue-900 text-white font-semibold text-xs rounded-lg">
          Back to Schemes Explorer
        </Link>
      </div>
    );
  }

  const isVerified = scheme.verification_status === 'Verified';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button */}
      <Link to="/schemes" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Schemes Catalogue
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            {scheme.government_level === 'Central' ? (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                Central Government Scheme
              </span>
            ) : (
              <span className="bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-700" />
                {scheme.state} State Scheme
              </span>
            )}

            <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1 ${
              isVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'
            }`}>
              {isVerified ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
              {scheme.verification_status}
            </span>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span>Academic Year: <strong className="text-slate-800">{scheme.academic_year}</strong></span>
            <span>Last Verified: <strong className="text-slate-800">{scheme.last_verified}</strong></span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {scheme.scheme_name}
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            {scheme.department}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={scheme.official_website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white font-bold text-xs rounded-lg hover:bg-blue-800 transition-colors shadow-xs"
          >
            Visit Official Government Portal
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => onAskAI && onAskAI(scheme)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 font-bold text-xs rounded-lg hover:bg-purple-100 transition-colors"
          >
            Ask AI Assistant About This Scheme
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Overview, Eligibility, Documents, How to Apply */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Benefits */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-amber-600" />
              Scheme Benefits
            </h2>
            <ul className="space-y-2">
              {scheme.benefits.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Who May Be Eligible */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-5 h-5 text-blue-900" />
              Detailed Eligibility Requirements
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-bold block mb-1">Education Level:</span>
                <span className="text-slate-800 font-semibold">{scheme.education_level.join(', ')}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-bold block mb-1">Target Social Category:</span>
                <span className="text-slate-800 font-semibold">
                  {scheme.social_category.length > 0 ? scheme.social_category.join(', ') : 'All Categories'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-bold block mb-1">Max Annual Family Income:</span>
                <span className="text-slate-800 font-semibold">
                  {scheme.maximum_family_income ? `₹${parseFloat(scheme.maximum_family_income).toLocaleString('en-IN')}` : 'No limit specified'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-bold block mb-1">Gender Requirement:</span>
                <span className="text-slate-800 font-semibold">{scheme.gender}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-bold block mb-1">School / Institution Rule:</span>
                <span className="text-slate-800 font-semibold">{scheme.school_requirement || 'Recognized School'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-bold block mb-1">Domicile Requirement:</span>
                <span className="text-slate-800 font-semibold">{scheme.domicile_requirement || 'Indian Resident'}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
              <strong>Academic Criterion:</strong> {scheme.academic_requirement}
            </div>
          </div>

          {/* Section: Required Documents */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-indigo-700" />
              Required Documents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scheme.required_documents.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: How to Apply */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-slate-800" />
              How to Apply (Application Procedure)
            </h2>
            <ol className="space-y-3">
              {scheme.application_process.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right 1 Col: Metadata & Disclaimer Box */}
        <div className="space-y-6">
          {/* Important Legal Disclaimer Card */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2 text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              Official Eligibility Disclaimer
            </div>
            <p className="leading-relaxed">
              "Based on the information provided, a student may meet the listed criteria. Final eligibility is determined by the relevant government authority upon application verification."
            </p>
          </div>

          {/* Dates Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Application Dates
            </h3>
            <div className="space-y-2 text-slate-700">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500 font-semibold">Start Date:</span>
                <span className="font-bold">{scheme.application_start_date || 'Official notification pending'}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-semibold">End Date / Deadline:</span>
                <span className="font-bold text-red-600">{scheme.application_end_date || 'Refer official portal'}</span>
              </div>
            </div>
          </div>

          {/* Verification Source Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Verification & Citation Metadata
            </h3>
            <div className="space-y-2 text-slate-700">
              <p><strong className="text-slate-900">Source Title:</strong> {scheme.source_title}</p>
              <p><strong className="text-slate-900">Verification Status:</strong> {scheme.verification_status}</p>
              <p><strong className="text-slate-900">Last Verified Date:</strong> {scheme.last_verified}</p>
              <p><strong className="text-slate-900">Academic Year:</strong> {scheme.academic_year}</p>

              {scheme.official_document_url && (
                <div className="pt-2">
                  <a
                    href={scheme.official_document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-900 hover:underline font-bold text-[11px]"
                  >
                    View Official Guidelines PDF
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
