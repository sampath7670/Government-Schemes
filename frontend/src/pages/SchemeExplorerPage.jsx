import React, { useState, useEffect } from 'react';
import { fetchStates, fetchSchemes } from '../services/api';
import SchemeCard from '../components/SchemeCard';
import SchemeFilters from '../components/SchemeFilters';
import { Search, Building2, CheckCircle2, ShieldAlert, Sparkles, Loader2, BookOpen } from 'lucide-react';

export default function SchemeExplorerPage({ currentProfile, onAskAI }) {
  const [statesList, setStatesList] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    state: currentProfile.state || 'Andhra Pradesh',
    education_level: 'Class 10',
    category: '',
    government_level: '',
    verification_status: '',
    query: ''
  });

  useEffect(() => {
    loadStates();
  }, []);

  useEffect(() => {
    loadSchemesData();
  }, [filters]);

  const loadStates = async () => {
    try {
      const data = await fetchStates();
      setStatesList(data);
    } catch (err) {
      console.error("Error loading states:", err);
    }
  };

  const loadSchemesData = async () => {
    setLoading(true);
    try {
      const data = await fetchSchemes(filters);
      setSchemes(data);
    } catch (err) {
      console.error("Error fetching schemes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      state: currentProfile.state || 'Andhra Pradesh',
      education_level: 'Class 10',
      category: '',
      government_level: '',
      verification_status: '',
      query: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-800 text-blue-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Class 10 Student Welfare Module
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              Verified Government Sources
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Government Scheme Catalogue
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Discover scholarships, fee support, and educational assistance across 28 States, 8 Union Territories & Central Government.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-200">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Active Jurisdiction: <strong className="text-white">{filters.state || 'All Jurisdictions'}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Education Level: <strong className="text-white">{filters.education_level || 'All Levels'}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters + Scheme List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1">
          <SchemeFilters
            statesList={statesList}
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={handleReset}
          />
        </div>

        {/* Right Schemes Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Status Counter Bar */}
          <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs font-bold text-slate-700">
              Showing <span className="text-blue-900 font-extrabold text-sm">{schemes.length}</span> schemes for{' '}
              <span className="text-slate-900 underline">{filters.state || 'All Jurisdictions'}</span> (Class 10 / Secondary)
            </p>

            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified: {schemes.filter(s => s.verification_status === 'Verified').length}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-900 animate-spin" />
              <p className="text-sm font-semibold">Fetching official scheme data...</p>
            </div>
          ) : schemes.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No schemes matched specified criteria</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                "No currently verified Class 10 scheme found for the selected state and category in available official sources."
              </p>
              <button
                onClick={handleReset}
                className="inline-block text-xs font-bold text-blue-900 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {schemes.map((scheme) => (
                <SchemeCard
                  key={scheme.scheme_id}
                  scheme={scheme}
                  onAskAI={onAskAI}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
