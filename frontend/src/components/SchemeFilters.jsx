import React from 'react';
import { Filter, Search, RotateCcw, Building2, BookOpen, Users, ShieldCheck, DollarSign } from 'lucide-react';

export default function SchemeFilters({
  statesList = [],
  filters,
  onFilterChange,
  onResetFilters
}) {
  const educationLevels = [
    'Class 10',
    'Class 9',
    'Class 11',
    'Class 12',
    'Degree',
    'B.Tech',
    'M.Tech',
    'Master\'s'
  ];

  const socialCategories = [
    'All Categories',
    'SC',
    'ST',
    'OBC',
    'EBC',
    'DNT',
    'Minority',
    'EWS',
    'General'
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-900" />
          <h2 className="font-bold text-slate-900 text-base">Filter Schemes</h2>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-slate-500 hover:text-blue-900 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      </div>

      <div className="space-y-4">
        {/* Search Query */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Search Term
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Scheme name, keyword..."
              value={filters.query || ''}
              onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>
        </div>

        {/* State / UT Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>State / Jurisdiction</span>
            <span className="text-[10px] text-blue-700 font-bold">36 States/UTs + Central</span>
          </label>
          <select
            value={filters.state || ''}
            onChange={(e) => onFilterChange({ ...filters, state: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            <option value="">All Jurisdictions</option>
            {statesList.map((st) => (
              <option key={st.id} value={st.name}>
                {st.name} ({st.type})
              </option>
            ))}
          </select>
        </div>

        {/* Education Level */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Education Level
          </label>
          <select
            value={filters.education_level || 'Class 10'}
            onChange={(e) => onFilterChange({ ...filters, education_level: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            {educationLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl} {lvl === 'Class 10' ? '(Primary Module)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Social Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Social Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value === 'All Categories' ? '' : e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            {socialCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Government Level */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Government Level
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {['All', 'Central', 'State'].map((lvl) => {
              const active = (filters.government_level || 'All') === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, government_level: lvl === 'All' ? '' : lvl })}
                  className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all ${
                    active
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Verification Status Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Verification Status
          </label>
          <select
            value={filters.verification_status || ''}
            onChange={(e) => onFilterChange({ ...filters, verification_status: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            <option value="">All Verification Statuses</option>
            <option value="Verified">Verified Only (Official Sources)</option>
            <option value="Needs Verification">Needs Verification</option>
          </select>
        </div>
      </div>
    </div>
  );
}
