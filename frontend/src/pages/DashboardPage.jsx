import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchSchemesByState, checkEligibility } from '../services/api';
import SchemeCard from '../components/SchemeCard';
import { LayoutDashboard, Award, Building2, UserCheck, ShieldCheck, ArrowRight, Heart, Sparkles, Sliders } from 'lucide-react';

export default function DashboardPage({ currentProfile, onOpenProfileModal, onAskAI }) {
  const [stateSchemes, setStateSchemes] = useState([]);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [currentProfile]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [schemesRes, eligRes] = await Promise.all([
        fetchSchemesByState(currentProfile.state),
        checkEligibility(currentProfile)
      ]);
      setStateSchemes(schemesRes);
      setEligibilityData(eligRes);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const centralCount = stateSchemes.filter(s => s.government_level === 'Central').length;
  const stateOnlyCount = stateSchemes.filter(s => s.government_level !== 'Central').length;
  const potentialCount = eligibilityData?.potentially_relevant?.length || 0;

  const categories = [
    { name: 'Scholarships', icon: '🎓', query: 'Scholarship' },
    { name: 'Girl Students', icon: '👧', query: 'Girl' },
    { name: 'SC/ST/OBC', icon: '👥', query: 'SC' },
    { name: 'Disability Support', icon: '♿', query: 'Disability' },
    { name: 'Low Income', icon: '💰', query: 'Income' },
    { name: 'School Assistance', icon: '🏫', query: 'School' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-800 text-blue-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Student Dashboard
            </span>
            <span className="bg-amber-400/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-400/30">
              {currentProfile.class_name || 'Class 10'} Module
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentProfile.name || 'Student'}!
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Discover government schemes tailored for your education level, state, and category.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-medium text-slate-200">
            <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/15">
              Class: <strong>{currentProfile.class_name || 'Class 10'}</strong>
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/15">
              State: <strong>{currentProfile.state}</strong>
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/15">
              Category: <strong>{currentProfile.category}</strong>
            </span>
          </div>
        </div>

        <button
          onClick={onOpenProfileModal}
          className="px-5 py-2.5 bg-white text-blue-950 hover:bg-slate-100 font-extrabold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2"
        >
          <Sliders className="w-4 h-4 text-blue-900" />
          Update Profile Parameters
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Potentially Relevant</span>
            <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">{potentialCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Matching profile criteria</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{currentProfile.state} State Schemes</span>
            <span className="text-3xl font-extrabold text-indigo-700 mt-1 block">{stateOnlyCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">State specific catalogue</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Central Government Schemes</span>
            <span className="text-3xl font-extrabold text-amber-600 mt-1 block">{centralCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">National NSP & Ministry schemes</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Category Shortcuts */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Explore by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/schemes?query=${encodeURIComponent(cat.query)}`}
              className="bg-white hover:bg-blue-50/50 p-4 rounded-xl border border-slate-200 text-center space-y-1 transition-all group shadow-2xs hover:border-blue-300"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</div>
              <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-900">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Schemes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Verified Schemes for {currentProfile.state} & Central
          </h2>
          <Link to="/schemes" className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1">
            View All ({stateSchemes.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stateSchemes.slice(0, 4).map((scheme) => (
            <SchemeCard
              key={scheme.scheme_id}
              scheme={scheme}
              onAskAI={onAskAI}
              isPotentiallyRelevant={eligibilityData?.potentially_relevant?.some(p => p.scheme.scheme_id === scheme.scheme_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
