import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function RewrittenResume({ content = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-800">AI 优化后的简历</h3>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            基于目标职位 JD 重写 · 保留真实经历 · 优化措辞与侧重点
          </p>
        </div>
        <button
          onClick={handleCopy}
          className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            copied
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-95'
              : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 hover:border-primary-300'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              已复制！
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              复制内容
            </>
          )}
        </button>
      </div>

      {/* Document card */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)]">
        {/* macOS-style window bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <span className="w-3 h-3 rounded-full bg-red-400/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <span className="w-3 h-3 rounded-full bg-green-400/80" />
          <span className="mx-auto text-xs text-gray-400 font-medium tracking-wide">
            AI_优化简历.md
          </span>
          <span className="w-3 h-3" />
        </div>

        {/* Resume content */}
        <div className="bg-white px-10 py-8 resume-prose">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
