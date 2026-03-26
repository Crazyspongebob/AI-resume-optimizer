import { useEffect, useState } from 'react';

function getColor(score) {
  if (score < 50) return { stroke: '#ef4444', grad0: '#f97316', text: '#dc2626', label: '需要优化', bg: 'bg-red-50', border: 'border-red-100' };
  if (score < 75) return { stroke: '#3b82f6', grad0: '#8b5cf6', text: '#2563eb', label: '基本匹配', bg: 'bg-blue-50', border: 'border-blue-100' };
  return { stroke: '#10b981', grad0: '#06b6d4', text: '#059669', label: '高度匹配', bg: 'bg-emerald-50', border: 'border-emerald-100' };
}

function useAnimatedValue(target, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function MiniRing({ value, color }) {
  const animated = useAnimatedValue(value, 1200);
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - animated / 100);
  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg width="48" height="48" className="-rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle
          cx="24" cy="24" r={r}
          fill="none" stroke={color.stroke} strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.04s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color: color.text }}>{animated}</span>
      </div>
    </div>
  );
}

const BREAKDOWN_ITEMS = [
  { label: '技能匹配', key: 'skillMatch', weight: '权重 40%', desc: '核心技能与工具覆盖程度' },
  { label: '经验匹配', key: 'experienceMatch', weight: '权重 30%', desc: '年限、项目规模与JD契合' },
  { label: '学历匹配', key: 'educationMatch', weight: '权重 10%', desc: '学历背景符合程度' },
  { label: '综合契合', key: 'overallFit', weight: '权重 20%', desc: '软技能与整体适配度' },
];

export default function ScoreGauge({ score, breakdown }) {
  const animated = useAnimatedValue(score, 1600);
  const color = getColor(score);

  const r = 90;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - animated / 100);
  const gradId = 'scoreRingGrad';

  const interpretation =
    score >= 85 ? '当前评分处于优秀区间，建议重点优化缺失关键词以进一步提升面试邀约率。' :
    score >= 70 ? '当前评分良好，参考优化建议针对性改进可显著提升简历竞争力。' :
    score >= 55 ? '当前评分处于中等区间，重点落实高优先级建议可有效提升匹配度。' :
    '当前评分有较大提升空间，建议按优先级逐一落实优化建议。';

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

        {/* ── Main Score Ring ── */}
        <div className="relative shrink-0">
          <svg width="220" height="220" className="-rotate-90" style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.08))' }}>
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color.grad0} />
                <stop offset="100%" stopColor={color.stroke} />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle cx="110" cy="110" r={r} fill="none" stroke="#f1f5f9" strokeWidth="14" />
            {/* Progress */}
            <circle
              cx="110" cy="110" r={r}
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.04s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black leading-none" style={{ color: color.text }}>
              {animated}
            </span>
            <span className="text-sm text-gray-400 mt-1 font-medium">/ 100</span>
            <span
              className="mt-3 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${color.stroke}18`,
                color: color.text,
                border: `1px solid ${color.stroke}35`,
              }}
            >
              {color.label}
            </span>
          </div>
        </div>

        {/* ── Sub-Score Cards ── */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BREAKDOWN_ITEMS.map(item => {
            const val = breakdown?.[item.key] || 0;
            const c = getColor(val);
            return (
              <div key={item.key} className={`${c.bg} ${c.border} border rounded-xl p-4 flex items-center gap-3`}>
                <MiniRing value={val} color={c} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                    <span className="text-xs text-gray-400 shrink-0">{item.weight}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
                  <div className="mt-2 h-1.5 bg-white/70 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${val}%`, backgroundColor: c.stroke }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Interpretation Footer ── */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
        <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-700">评分说明：</span>
          综合评分基于技能匹配（40%）、工作经验（30%）、综合契合度（20%）及教育背景（10%）加权计算。
          {' '}{interpretation}
        </p>
      </div>
    </div>
  );
}
