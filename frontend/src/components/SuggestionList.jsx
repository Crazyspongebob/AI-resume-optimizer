const PRIORITY_CONFIG = {
  high: {
    label: '高优先级',
    accent: '#ef4444',
    borderLeft: 'border-l-red-500',
    numBg: 'bg-red-50',
    numText: 'text-red-400',
    badgeBg: 'bg-red-500',
    issueBg: 'bg-red-50',
    issueBorder: 'border-red-100',
    issueText: 'text-red-800',
  },
  medium: {
    label: '中优先级',
    accent: '#f59e0b',
    borderLeft: 'border-l-amber-500',
    numBg: 'bg-amber-50',
    numText: 'text-amber-400',
    badgeBg: 'bg-amber-500',
    issueBg: 'bg-amber-50',
    issueBorder: 'border-amber-100',
    issueText: 'text-amber-800',
  },
  low: {
    label: '低优先级',
    accent: '#94a3b8',
    borderLeft: 'border-l-slate-300',
    numBg: 'bg-slate-50',
    numText: 'text-slate-400',
    badgeBg: 'bg-slate-400',
    issueBg: 'bg-slate-50',
    issueBorder: 'border-slate-100',
    issueText: 'text-slate-600',
  },
};

export default function SuggestionList({ suggestions = [] }) {
  const sorted = [...suggestions].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.priority] ?? 2) - (order[b.priority] ?? 2);
  });

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg className="w-14 h-14 mb-4 opacity-25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium">暂无优化建议</p>
      </div>
    );
  }

  const highCount = sorted.filter(s => s.priority === 'high').length;

  return (
    <div className="animate-fade-in">
      {/* Header summary */}
      <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm text-gray-600">
          共 <span className="font-bold text-gray-800">{sorted.length}</span> 条优化建议
          {highCount > 0 && (
            <>, 其中 <span className="font-bold text-red-600">{highCount}</span> 条高优先级建议直接影响初筛通过率</>
          )}
        </p>
      </div>

      {/* Suggestion cards */}
      <div className="space-y-4">
        {sorted.map((item, i) => {
          const cfg = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.low;
          return (
            <div
              key={i}
              className={`bg-white border border-gray-100 border-l-4 ${cfg.borderLeft} rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 animate-slide-up-fade`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-stretch">
                {/* Number column */}
                <div className={`${cfg.numBg} flex items-center justify-center px-4 shrink-0`}>
                  <span className={`text-xl font-black ${cfg.numText}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 min-w-0">
                  {/* Tags row */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${cfg.badgeBg} text-white`}>
                      {cfg.label}
                    </span>
                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {item.section}
                    </span>
                  </div>

                  {/* Issue block */}
                  <div className={`${cfg.issueBg} border ${cfg.issueBorder} rounded-lg px-3.5 py-2.5 mb-3`}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">发现问题</p>
                    <p className={`text-sm ${cfg.issueText} leading-relaxed`}>{item.issue}</p>
                  </div>

                  {/* Suggestion */}
                  <div className="flex items-start gap-2.5">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed flex-1">{item.suggestion}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
