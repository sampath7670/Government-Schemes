import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ExternalLink, HelpCircle, Calendar, Building2, Award, Sparkles, BookOpen } from 'lucide-react';

export default function SchemeCard({ scheme, onAskAI, isPotentiallyRelevant = false }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const isVerified = scheme.verification_status === 'Verified';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative">
      {/* Top Banner Tag */}
      <div className="px-5 pt-4 pb-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          {scheme.government_level === 'Central' ? (
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-md">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              Central Scheme
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold px-2.5 py-0.5 rounded-md">
              <Building2 className="w-3.5 h-3.5 text-indigo-700" />
              {scheme.state} State Scheme
            </span>
          )}

          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-md">
            <BookOpen className="w-3 h-3 text-slate-500" />
            {scheme.education_level.join(', ')}
          </span>
        </div>

        {/* Verification Badge with Tooltip */}
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border cursor-pointer ${
              isVerified
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-amber-50 text-amber-700 border-amber-300'
            }`}
          >
            {isVerified ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            )}
            {scheme.verification_status}
          </button>

          {showTooltip && (
            <div className="absolute right-0 top-7 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-50 transition-opacity">
              <p className="font-semibold mb-1">
                {isVerified ? 'Verified Official Record' : 'Needs Verification'}
              </p>
              <p className="text-slate-300 text-[11px] leading-snug">
                {isVerified
                  ? `Confirmed from official current government source (${scheme.source_title || 'Official Portal'}).`
                  : 'Sourced from candidate catalogue. Awaiting direct official portal verification.'}
              </p>
              <p className="mt-1 text-[10px] text-slate-400">Academic Year: {scheme.academic_year}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 flex-1">
        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">
          {scheme.scheme_name}
        </h3>
        <p className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          {scheme.department}
        </p>

        {/* Key Highlights Grid */}
        <div className="grid grid-cols-1 gap-2.5 mb-4 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="font-bold text-slate-700 block mb-0.5">Benefit Summary:</span>
            <p className="text-slate-600 line-clamp-2">
              {scheme.scholarship_benefit || (scheme.benefits.length > 0 ? scheme.benefits[0] : 'Financial assistance')}
            </p>
          </div>

          <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/60">
            <span className="font-bold text-blue-900 block mb-0.5">Key Eligibility Criteria:</span>
            <p className="text-blue-800 line-clamp-2">
              {scheme.academic_requirement || 'Recognized school student meeting income & category guidelines.'}
            </p>
          </div>
        </div>

        {/* Verification Dates & Details */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Academic Year: <strong className="text-slate-700">{scheme.academic_year}</strong></span>
          </div>
          <div>
            <span>Verified: <strong className="text-slate-700">{scheme.last_verified}</strong></span>
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isPotentiallyRelevant && (
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Potentially Relevant
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAskAI && onAskAI(scheme)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Ask AI
          </button>

          <a
            href={scheme.official_website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
          >
            Official Source
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          <Link
            to={`/schemes/${scheme.scheme_id}`}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold bg-blue-900 text-white hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
