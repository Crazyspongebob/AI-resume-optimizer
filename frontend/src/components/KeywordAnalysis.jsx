export default function KeywordAnalysis({ matched = [], missing = [], extra = [] }) {
  const total = matched.length + missing.length;
  const coverage = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Coverage Summary ── */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-sm font-semibold text-gray-800">关键词覆盖率</span>
            <span className="ml-2 text-xs text-gray-400">（命中 / 总计）</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-primary-600">{coverage}%</span>
            <span className="text-sm text-gray-400">&nbsp;{matched.length} / {total}</span>
          </div>
        </div>
        <div className="h-2.5 bg-white/80 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out"
            style={{ width: `${coverage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2.5">
          {coverage >= 80
            ? '关键词覆盖优秀，简历与 JD 高度契合。'
            : coverage >= 60
            ? '关键词覆盖良好，补充缺失技能可进一步提升匹配度。'
            : '关键词缺失较多，建议优先在简历中补充高优先级技能描述。'}
        </p>
      </div>

      {/* ── Matched & Missing Side by Side ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Matched */}
        <div>
          <h3 className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-emerald-800">命中关键词</span>
            <span className="ml-auto text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-medium">
              {matched.length} 个
            </span>
          </h3>
          {matched.length === 0 ? (
            <p className="text-sm text-gray-400 italic">暂无匹配关键词</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {matched.map((item, i) => (
                <span
                  key={item}
                  className="tag-enter inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Missing */}
        <div>
          <h3 className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
              <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-red-800">缺失关键词</span>
            <span className="ml-auto text-xs text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full font-medium">
              {missing.length} 个
            </span>
          </h3>
          {missing.length === 0 ? (
            <p className="text-sm text-emerald-600 font-medium italic">无缺失，关键词全覆盖！</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {missing.map((item, i) => (
                <span
                  key={item}
                  className="tag-enter inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Extra Keywords ── */}
      {extra.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-slate-700">额外技能</span>
            <span className="text-xs text-slate-400 ml-1">（可作差异化亮点）</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {extra.map((item, i) => (
              <span
                key={item}
                className="tag-enter inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors"
                style={{ animationDelay: `${i * 35}ms` }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
