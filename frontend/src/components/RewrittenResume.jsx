import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

// Inline styles that mirror resume-prose, embedded into exported HTML
const RESUME_STYLES = `
  body { margin: 2.5cm 2cm; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif; color: #374151; line-height: 1.75; }
  h1 { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.15rem; padding-bottom: 0.6rem; border-bottom: 2px solid #2563eb; }
  h2 { font-size: 1rem; font-weight: 700; color: #1e40af; margin-top: 1.75rem; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em; }
  h3 { font-size: 0.9rem; font-weight: 700; color: #1e293b; margin-top: 1rem; margin-bottom: 0.2rem; }
  p { color: #475569; font-size: 0.875rem; line-height: 1.75; margin-bottom: 0.4rem; }
  ul { padding-left: 1.2rem; margin-bottom: 0.5rem; }
  li { color: #475569; font-size: 0.875rem; line-height: 1.75; margin-bottom: 0.15rem; list-style-type: disc; }
  strong { color: #0f172a; font-weight: 700; }
  em { color: #64748b; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 1.25rem 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.85rem; }
  th { background: #eff6ff; color: #1e40af; padding: 0.5rem 0.75rem; text-align: left; font-weight: 600; border: 1px solid #dbeafe; }
  td { padding: 0.45rem 0.75rem; border: 1px solid #e2e8f0; color: #475569; }
  tr:nth-child(even) td { background: #f8fafc; }
  blockquote { border-left: 3px solid #3b82f6; padding-left: 1rem; color: #64748b; font-style: italic; margin: 0.75rem 0; }
`;

export default function RewrittenResume({ content = '' }) {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

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

  const handleDownloadHTML = () => {
    const inner = contentRef.current?.innerHTML ?? '';
    const html = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI 优化简历</title>
  <style>${RESUME_STYLES}</style>
</head>
<body>${inner}</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AI_优化简历.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    // Populate the hidden print area then trigger print
    const printArea = document.getElementById('resume-print-area');
    if (printArea && contentRef.current) {
      printArea.innerHTML = contentRef.current.innerHTML;
    }
    window.print();
  };

  return (
    <>
      {/* Hidden area used only during browser print / Save as PDF */}
      <div id="resume-print-area" style={{ display: 'none' }} className="resume-prose" />

      <div className="animate-fade-in">
        {/* Toolbar */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-semibold text-gray-800">AI 优化后的简历</h3>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              基于目标职位 JD 重写 · 保留真实经历 · 优化措辞与侧重点
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Copy */}
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
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
                  复制
                </>
              )}
            </button>

            {/* Download HTML */}
            <button
              onClick={handleDownloadHTML}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              HTML
            </button>

            {/* Save as PDF (browser print dialog) */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              PDF
            </button>
          </div>
        </div>

        {/* Document card */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)]">
          {/* macOS-style window bar */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <span className="w-3 h-3 rounded-full bg-red-400/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <span className="w-3 h-3 rounded-full bg-green-400/80" />
            <span className="mx-auto text-xs text-gray-400 font-medium tracking-wide">
              AI_优化简历.html
            </span>
            <span className="w-3 h-3" />
          </div>

          {/* Resume content */}
          <div ref={contentRef} className="bg-white px-10 py-8 resume-prose">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </>
  );
}
