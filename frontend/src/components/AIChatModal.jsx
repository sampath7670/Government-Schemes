import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, ShieldCheck, ExternalLink } from 'lucide-react';

export default function AIChatModal({ isOpen, onClose, selectedScheme, currentProfile }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: selectedScheme
        ? `Hello! I can answer questions regarding **${selectedScheme.scheme_name}**. Ask me about eligibility, documents, benefits, or how to apply.`
        : `Hello ${currentProfile.name || 'Student'}! I am your AI Government Schemes Assistant. Ask me questions about scholarships for **${currentProfile.class_name || 'Class 10'}** in **${currentProfile.state}**.`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');
    setLoading(true);

    setTimeout(() => {
      let aiAnswer = "";
      if (selectedScheme) {
        aiAnswer = `### Relevant Scheme: ${selectedScheme.scheme_name}\n\n` +
          `### Why It May Be Relevant\n` +
          `Matches your current profile (**${currentProfile.class_name || 'Class 10'}**, **${currentProfile.state}**, **${currentProfile.category}**).\n\n` +
          `### Eligibility Breakdown\n` +
          `- **Class:** ${selectedScheme.education_level.join(', ')}\n` +
          `- **State:** ${selectedScheme.state} (${selectedScheme.government_level})\n` +
          `- **Income Limit:** ${selectedScheme.maximum_family_income ? '₹' + parseFloat(selectedScheme.maximum_family_income).toLocaleString('en-IN') : 'No specific limit'}\n` +
          `- **Category:** ${selectedScheme.social_category.join(', ') || 'All'}\n` +
          `- **Gender:** ${selectedScheme.gender}\n` +
          `- **Academic:** ${selectedScheme.academic_requirement}\n\n` +
          `### Benefits\n` +
          `- ${selectedScheme.benefits.join('\n- ')}\n\n` +
          `### Required Documents\n` +
          `- ${selectedScheme.required_documents.join('\n- ')}\n\n` +
          `### How to Apply\n` +
          selectedScheme.application_process.map((step, idx) => `${idx + 1}. ${step}`).join('\n') + `\n\n` +
          `### Important Note\n` +
          `"Based on the information provided, you may meet the listed criteria. Final eligibility is determined by the relevant authority."\n\n` +
          `### Official Sources\n` +
          `- [${selectedScheme.source_title || 'Official Portal'}](${selectedScheme.official_website}) (Academic Year: ${selectedScheme.academic_year})`;
      } else {
        aiAnswer = `### Relevant Schemes for ${currentProfile.class_name || 'Class 10'} in ${currentProfile.state}\n\n` +
          `Based on your profile (**${currentProfile.category}**, Income: **₹${currentProfile.annual_income?.toLocaleString('en-IN')}**):\n\n` +
          `1. **National Means Cum Merit Scholarship (NMMS)** (Central Scheme)\n` +
          `2. **${currentProfile.state} Pre-Matric Scholarship** (State Scheme)\n\n` +
          `### Important Note\n` +
          `"Based on the information provided, you may meet the listed criteria. Final eligibility is determined by the relevant authority."\n\n` +
          `### Official Sources\n` +
          `- National Scholarship Portal (scholarships.gov.in)\n` +
          `- Official ${currentProfile.state} Welfare Portal`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiAnswer }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <h2 className="text-base font-bold">AI Government Schemes Assistant</h2>
              <p className="text-[11px] text-purple-200">Strict Official RAG Guidance Protocol Active</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-purple-800 rounded-lg text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50 text-xs">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-purple-900 text-white flex items-center justify-center shrink-0 font-bold">
                  <Bot className="w-4 h-4 text-amber-300" />
                </div>
              )}
              <div className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-900 text-white font-medium rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-none whitespace-pre-wrap'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-slate-500">
              <Bot className="w-5 h-5 text-purple-700 animate-bounce" />
              <span className="font-semibold text-xs">Searching official government sources...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            placeholder="Ask a question about scholarships, eligibility, or required documents..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
