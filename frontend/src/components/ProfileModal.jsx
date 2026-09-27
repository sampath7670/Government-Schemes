import React, { useState } from 'react';
import { X, User, Save, Building2, GraduationCap, DollarSign, Award, Heart } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, profile, onSaveProfile, statesList }) {
  const [formData, setFormData] = useState(profile);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-blue-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold">Edit Student Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-800 rounded-lg transition-colors text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Student Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                State / UT
              </label>
              <select
                value={formData.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
                {statesList.filter(s => s.type !== 'Central').map((st) => (
                  <option key={st.id} value={st.name}>
                    {st.name} ({st.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Education Level / Class */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Education Level
              </label>
              <select
                value={formData.education_level || 'Class 10'}
                onChange={(e) => handleChange('education_level', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
                <option value="Class 10">Class 10 (Secondary)</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="Degree">Degree / Graduation</option>
                <option value="B.Tech">B.Tech</option>
              </select>
            </div>

            {/* Social Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Social Category
              </label>
              <select
                value={formData.category || 'General'}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="EBC">EBC (Economically Backward Class)</option>
                <option value="DNT">DNT (De-notified Tribes)</option>
                <option value="Minority">Minority Community</option>
                <option value="EWS">EWS</option>
                <option value="General">General / Open</option>
              </select>
            </div>

            {/* Annual Family Income */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Annual Family Income (₹)
              </label>
              <input
                type="number"
                value={formData.annual_income || 150000}
                onChange={(e) => handleChange('annual_income', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gender
              </label>
              <select
                value={formData.gender || 'Female'}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="All">Other / All</option>
              </select>
            </div>

            {/* School Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                School Type
              </label>
              <select
                value={formData.school_type || 'Government'}
                onChange={(e) => handleChange('school_type', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
                <option value="Government">Government / Local Body School</option>
                <option value="Government-Aided">Government-Aided School</option>
                <option value="Private">Private Recognized School</option>
              </select>
            </div>

            {/* Disability Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Disability Status (PwD)
              </label>
              <select
                value={formData.is_pwd ? 'Yes' : 'No'}
                onChange={(e) => handleChange('is_pwd', e.target.value === 'Yes')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
                <option value="No">No Benchmark Disability</option>
                <option value="Yes">Yes (40%+ Disability / UDID)</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-blue-900 text-white hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              Save Student Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
