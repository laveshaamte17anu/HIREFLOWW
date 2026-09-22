import React from 'react';
import { Sparkles } from 'lucide-react';

const MatchScoreBadge = ({ score }) => {
  let colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score < 60) {
    colorClass = 'bg-slate-100 text-slate-700 border-slate-200';
  } else if (score < 80) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${colorClass}`}
    >
      <Sparkles className="w-3.5 h-3.5" />
      <span>{score}% Match</span>
    </span>
  );
};

export default MatchScoreBadge;
