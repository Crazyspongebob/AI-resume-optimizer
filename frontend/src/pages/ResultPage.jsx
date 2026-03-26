import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisContext } from '../AnalysisContext';
import ResultTabs from '../components/ResultTabs';
import ScoreGauge from '../components/ScoreGauge';
import SuggestionList from '../components/SuggestionList';
import KeywordAnalysis from '../components/KeywordAnalysis';
import RewrittenResume from '../components/RewrittenResume';
import { downloadReportHTML } from '../utils/exportReport';

function getScoreConfig(score) {
  if (score >= 85) return { label: '非常匹配', color: '#10b981', dimColor: '#d1fae5', textOnDark: 'text-emerald-300' };
  if (score >= 70) return { label: '较为匹配', color: '#3b82f6', dimColor: '#dbeafe', textOnDark: 'text-blue-300' };
  if (score >= 55) return { label: '基本匹配', color: '#f59e0b', dimColor: '#fef3c7', textOnDark: 'text-amber-300' };
  return { label: '匹配度偏低', color: '#ef4444', dimColor: '#fee2e2', textOnDark: 'text-red-300' };
}

export default function ResultPage() {
  const navigate = useNavigate();
  const { result, inputData } = useAnalysisContext();

  useEffect(() => {
    if (!result) navigate('/input', { replace: true });
  }, [result, navigate]);

  if (!result) return null;

  const { matchScore, scoreBreakdown, keywordAnalysis, suggestions, rewrittenResume } = result;
  const { matched = [], missing = [], extra = [] } = keywordAnalysis || {};
  const cfg = getScoreConfig(matchScore);
  const highCount = (suggestions || []).filter(s => s.priority === 'high').length;

  const tabs = [
    { key: 'score', label: '匹配评分' },
    { key: 'keywords', label: '关键词分析', count: matched.length },
    { key: 'suggestions', label: '优化建议', count: highCount || undefined, countColor: 'red' },
    { key: 'rewrite', label: 'AI 简历' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Dark Hero Header ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 px-4 pt-5 pb-12">
        <div className="max-w-5xl mx-auto">

          {/* Back nav */}
          <button
            onClick={() => navigate('/input')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors mb-7 text-sm group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回修改输入
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

            {/* Left: title + JD preview */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2.5">
                <h1 className="text-2xl font-bold text-white">分析报告</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  已完成
                </span>
              </div>
              {inputData?.jobDescription && (
                <p className="text-slate-400 text-sm leading-relaxed max-w-lg line-clamp-2">
                  <span className="text-slate-500">目标职位 · </span>
                  {inputData.jobDescription.slice(0, 130)}
                  {inputData.jobDescription.length > 130 ? '…' : ''}
                </p>
              )}
            </div>

            {/* Right: score widget */}
            <div className="flex items-center gap-8 shrink-0">

              {/* Big score number */}
              <div className="text-center">
                <div className="text-7xl font-black leading-none" style={{ color: cfg.color }}>
                  {matchScore}
                </div>
                <div className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-medium">综合评分</div>
                <div
                  className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}44` }}
                >
                  {cfg.label}
                </div>
              </div>

              <div className="h-16 w-px bg-slate-700 hidden sm:block" />

              {/* Stat pills */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{matched.length}</div>
                  <div className="text-slate-500 text-xs mt-1">关键词命中</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{missing.length}</div>
                  <div className="text-slate-500 text-xs mt-1">关键词缺失</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{(suggestions || []).length}</div>
                  <div className="text-slate-500 text-xs mt-1">优化建议</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Card (overlaps header) ── */}
      <div className="max-w-5xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-gray-100 overflow-hidden">
          <ResultTabs tabs={tabs}>
            {(activeTab) => (
              <div className="p-6 md:p-8">
                {activeTab === 'score'       && <ScoreGauge score={matchScore} breakdown={scoreBreakdown} />}
                {activeTab === 'keywords'    && <KeywordAnalysis matched={matched} missing={missing} extra={extra} />}
                {activeTab === 'suggestions' && <SuggestionList suggestions={suggestions || []} />}
                {activeTab === 'rewrite'     && <RewrittenResume content={rewrittenResume || ''} />}
              </div>
            )}
          </ResultTabs>
        </div>

        {/* Bottom actions */}
        <div className="mt-6 flex items-center justify-center gap-3 pb-14 flex-wrap">
          <button
            onClick={() => navigate('/input')}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重新分析
          </button>
          <button
            onClick={() => downloadReportHTML(result, inputData)}
            className="btn-secondary flex items-center gap-2 text-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            导出完整报告
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}
