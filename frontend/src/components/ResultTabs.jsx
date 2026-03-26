import { useState } from 'react';

const TAB_ICONS = {
  score: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  keywords: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  suggestions: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  rewrite: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
};

const DEFAULT_TABS = [
  { key: 'score', label: '匹配评分' },
  { key: 'keywords', label: '关键词分析' },
  { key: 'suggestions', label: '优化建议' },
  { key: 'rewrite', label: 'AI 简历' },
];

export default function ResultTabs({ tabs, children }) {
  const activeTabs = tabs || DEFAULT_TABS;
  const [active, setActive] = useState(activeTabs[0]?.key || 'score');

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 md:px-6 py-3 border-b border-gray-100 bg-gray-50/80 overflow-x-auto">
        {activeTabs.map(tab => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-white text-primary-700 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/70'
              }`}
            >
              <span className={isActive ? 'text-primary-600' : 'text-gray-400'}>
                {TAB_ICONS[tab.key]}
              </span>
              {tab.label}
              {tab.count != null && (
                <span
                  className={`ml-0.5 inline-flex items-center justify-center min-w-[1.1rem] h-4.5 px-1 rounded-full text-xs font-bold leading-none py-0.5 ${
                    tab.countColor === 'red'
                      ? 'bg-red-500 text-white'
                      : 'bg-primary-100 text-primary-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div>{typeof children === 'function' ? children(active) : null}</div>
    </div>
  );
}
