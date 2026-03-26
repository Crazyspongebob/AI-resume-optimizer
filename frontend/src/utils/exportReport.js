/* exportReport.js
 * Generates a fully self-contained HTML file from analysis result data.
 * All 4 tabs are present in the DOM; vanilla JS handles switching.
 * No external dependencies — styles and a tiny markdown renderer are inlined.
 */

// ─── Tiny Markdown → HTML ────────────────────────────────────────────────────

function inlineMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function md2html(md) {
  const lines = (md || '').split('\n');
  let html = '';
  let inUl = false;

  for (const raw of lines) {
    const line = raw;
    if (/^### /.test(line)) {
      if (inUl) { html += '</ul>\n'; inUl = false; }
      html += `<h3>${inlineMarkdown(line.slice(4))}</h3>\n`;
    } else if (/^## /.test(line)) {
      if (inUl) { html += '</ul>\n'; inUl = false; }
      html += `<h2>${inlineMarkdown(line.slice(3))}</h2>\n`;
    } else if (/^# /.test(line)) {
      if (inUl) { html += '</ul>\n'; inUl = false; }
      html += `<h1>${inlineMarkdown(line.slice(2))}</h1>\n`;
    } else if (/^[-*] /.test(line)) {
      if (!inUl) { html += '<ul>\n'; inUl = true; }
      html += `<li>${inlineMarkdown(line.slice(2))}</li>\n`;
    } else if (/^---+$/.test(line.trim())) {
      if (inUl) { html += '</ul>\n'; inUl = false; }
      html += '<hr>\n';
    } else if (line.trim() === '') {
      if (inUl) { html += '</ul>\n'; inUl = false; }
    } else {
      if (inUl) { html += '</ul>\n'; inUl = false; }
      html += `<p>${inlineMarkdown(line)}</p>\n`;
    }
  }
  if (inUl) html += '</ul>\n';
  return html;
}

// ─── Score helpers ───────────────────────────────────────────────────────────

function scoreColor(score) {
  if (score >= 85) return { stroke: '#10b981', text: '#059669', label: '非常匹配' };
  if (score >= 70) return { stroke: '#3b82f6', text: '#2563eb', label: '较为匹配' };
  if (score >= 55) return { stroke: '#f59e0b', text: '#d97706', label: '基本匹配' };
  return { stroke: '#ef4444', text: '#dc2626', label: '匹配度偏低' };
}

function breakdownColor(score) {
  if (score >= 75) return { stroke: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', text: '#059669' };
  if (score >= 50) return { stroke: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', text: '#2563eb' };
  return { stroke: '#ef4444', bg: '#fef2f2', border: '#fecaca', text: '#dc2626' };
}

function svgRing(score, r, cx, cy, sw, color) {
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f1f5f9" stroke-width="${sw}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}"
      stroke-linecap="round"
      stroke-dasharray="${circ.toFixed(2)}"
      stroke-dashoffset="${offset.toFixed(2)}"/>`;
}

// ─── Section HTML builders ───────────────────────────────────────────────────

function buildScoreTab(matchScore, scoreBreakdown) {
  const c = scoreColor(matchScore);
  const r = 90, cx = 110, cy = 110;

  const ITEMS = [
    { label: '技能匹配', key: 'skillMatch',      weight: '40%', desc: '核心技能与工具覆盖程度' },
    { label: '经验匹配', key: 'experienceMatch', weight: '30%', desc: '年限、项目规模与JD契合' },
    { label: '学历匹配', key: 'educationMatch',  weight: '10%', desc: '学历背景符合程度' },
    { label: '综合契合', key: 'overallFit',      weight: '20%', desc: '软技能与整体适配度' },
  ];

  const cards = ITEMS.map(item => {
    const val = scoreBreakdown?.[item.key] || 0;
    const bc = breakdownColor(val);
    const miniR = 20, miniCirc = (2 * Math.PI * miniR).toFixed(2);
    const miniOffset = ((2 * Math.PI * miniR) * (1 - val / 100)).toFixed(2);
    return `
      <div style="background:${bc.bg};border:1px solid ${bc.border};border-radius:12px;padding:16px;display:flex;align-items:center;gap:12px;">
        <div style="position:relative;width:48px;height:48px;flex-shrink:0;">
          <svg width="48" height="48" style="transform:rotate(-90deg)">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" stroke-width="4"/>
            <circle cx="24" cy="24" r="20" fill="none" stroke="${bc.stroke}" stroke-width="4"
              stroke-linecap="round" stroke-dasharray="${miniCirc}" stroke-dashoffset="${miniOffset}"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:11px;font-weight:700;color:${bc.text}">${val}</span>
          </div>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px;">
            <span style="font-size:14px;font-weight:600;color:#1e293b">${item.label}</span>
            <span style="font-size:11px;color:#9ca3af;flex-shrink:0">权重 ${item.weight}</span>
          </div>
          <p style="font-size:12px;color:#6b7280;margin:4px 0 8px">${item.desc}</p>
          <div style="height:6px;background:rgba(255,255,255,0.7);border-radius:99px;overflow:hidden;">
            <div style="height:100%;width:${val}%;background:${bc.stroke};border-radius:99px;"></div>
          </div>
        </div>
      </div>`;
  }).join('');

  const interpretation =
    matchScore >= 85 ? '当前评分处于优秀区间，建议重点优化缺失关键词以进一步提升面试邀约率。' :
    matchScore >= 70 ? '当前评分良好，参考优化建议针对性改进可显著提升简历竞争力。' :
    matchScore >= 55 ? '当前评分处于中等区间，重点落实高优先级建议可有效提升匹配度。' :
    '当前评分有较大提升空间，建议按优先级逐一落实优化建议。';

  return `
    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:40px;">
      <div style="position:relative;flex-shrink:0;">
        <svg width="220" height="220" style="transform:rotate(-90deg);filter:drop-shadow(0 4px 20px rgba(0,0,0,0.08))">
          <defs>
            <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="${c.stroke}99"/>
              <stop offset="100%" stop-color="${c.stroke}"/>
            </linearGradient>
          </defs>
          ${svgRing(matchScore, r, cx, cy, 14, 'url(#sg)')}
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <span style="font-size:56px;font-weight:900;line-height:1;color:${c.text}">${matchScore}</span>
          <span style="font-size:13px;color:#9ca3af;margin-top:4px">/ 100</span>
          <span style="margin-top:10px;padding:3px 12px;border-radius:99px;font-size:12px;font-weight:600;background:${c.stroke}18;color:${c.text};border:1px solid ${c.stroke}35">${c.label}</span>
        </div>
      </div>
      <div style="flex:1;min-width:260px;display:grid;grid-template-columns:1fr 1fr;gap:12px">${cards}</div>
    </div>
    <div style="margin-top:24px;padding:16px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:13px;color:#4b5563;line-height:1.7">
      <strong style="color:#374151">评分说明：</strong>综合评分基于技能匹配（40%）、工作经验（30%）、综合契合度（20%）及教育背景（10%）加权计算。 ${interpretation}
    </div>`;
}

function buildKeywordsTab(matched, missing, extra) {
  const total = matched.length + missing.length;
  const coverage = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  const pill = (text, bg, color, border) =>
    `<span style="display:inline-flex;align-items:center;padding:4px 10px;border-radius:8px;font-size:12px;font-weight:500;background:${bg};color:${color};border:1px solid ${border};margin:3px">${text}</span>`;

  const matchedPills = matched.map(k => pill(k, '#ecfdf5', '#065f46', '#a7f3d0')).join('');
  const missingPills = missing.map(k => pill(k, '#fef2f2', '#991b1b', '#fecaca')).join('');
  const extraPills   = extra.map(k => pill(k, '#f8fafc', '#475569', '#e2e8f0')).join('');

  const coverageMsg =
    coverage >= 80 ? '关键词覆盖优秀，简历与 JD 高度契合。' :
    coverage >= 60 ? '关键词覆盖良好，补充缺失技能可进一步提升匹配度。' :
    '关键词缺失较多，建议优先在简历中补充高优先级技能描述。';

  return `
    <div style="padding:20px;border-radius:16px;background:linear-gradient(to right,#f8fafc,#eff6ff);border:1px solid #bfdbfe;margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span style="font-size:14px;font-weight:600;color:#1e293b">关键词覆盖率 <span style="font-size:12px;font-weight:400;color:#9ca3af">（命中 / 总计）</span></span>
        <span style="font-size:22px;font-weight:900;color:#2563eb">${coverage}% <span style="font-size:13px;font-weight:400;color:#9ca3af">${matched.length} / ${total}</span></span>
      </div>
      <div style="height:10px;background:rgba(255,255,255,0.8);border-radius:99px;overflow:hidden;">
        <div style="height:100%;width:${coverage}%;background:linear-gradient(to right,#3b82f6,#6366f1);border-radius:99px"></div>
      </div>
      <p style="font-size:12px;color:#6b7280;margin-top:8px">${coverageMsg}</p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
      <div>
        <h3 style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:#065f46;margin-bottom:10px">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:99px;background:#d1fae5">✓</span>
          命中关键词
          <span style="margin-left:auto;font-size:11px;background:#ecfdf5;color:#059669;border:1px solid #a7f3d0;padding:1px 8px;border-radius:99px">${matched.length} 个</span>
        </h3>
        <div>${matchedPills || '<p style="font-size:13px;color:#9ca3af;font-style:italic">暂无匹配关键词</p>'}</div>
      </div>
      <div>
        <h3 style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:#991b1b;margin-bottom:10px">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:99px;background:#fee2e2">✕</span>
          缺失关键词
          <span style="margin-left:auto;font-size:11px;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;padding:1px 8px;border-radius:99px">${missing.length} 个</span>
        </h3>
        <div>${missingPills || '<p style="font-size:13px;color:#059669;font-weight:500;font-style:italic">无缺失，关键词全覆盖！</p>'}</div>
      </div>
    </div>
    ${extra.length > 0 ? `
    <div>
      <h3 style="font-size:13px;font-weight:600;color:#475569;margin-bottom:10px">✦ 额外技能 <span style="font-size:12px;font-weight:400;color:#9ca3af">（可作差异化亮点）</span></h3>
      <div>${extraPills}</div>
    </div>` : ''}`;
}

function buildSuggestionsTab(suggestions) {
  if (!suggestions || suggestions.length === 0) {
    return `<div style="text-align:center;padding:80px 0;color:#9ca3af;font-size:14px">暂无优化建议</div>`;
  }

  const PRIORITY = {
    high:   { label: '高优先级', accent: '#ef4444', numBg: '#fef2f2', numText: '#fca5a5', badgeBg: '#ef4444', issueBg: '#fef2f2', issueBorder: '#fecaca', issueText: '#991b1b', leftBorder: '#ef4444' },
    medium: { label: '中优先级', accent: '#f59e0b', numBg: '#fffbeb', numText: '#fcd34d', badgeBg: '#f59e0b', issueBg: '#fffbeb', issueBorder: '#fde68a', issueText: '#92400e', leftBorder: '#f59e0b' },
    low:    { label: '低优先级', accent: '#94a3b8', numBg: '#f8fafc', numText: '#cbd5e1', badgeBg: '#94a3b8', issueBg: '#f8fafc', issueBorder: '#e2e8f0', issueText: '#475569', leftBorder: '#cbd5e1' },
  };

  const sorted = [...suggestions].sort((a, b) => {
    const o = { high: 0, medium: 1, low: 2 };
    return (o[a.priority] ?? 2) - (o[b.priority] ?? 2);
  });

  const highCount = sorted.filter(s => s.priority === 'high').length;

  const cards = sorted.map((item, i) => {
    const cfg = PRIORITY[item.priority] || PRIORITY.low;
    return `
      <div style="background:#fff;border:1px solid #f1f5f9;border-left:4px solid ${cfg.leftBorder};border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:14px;display:flex">
        <div style="background:${cfg.numBg};display:flex;align-items:center;justify-content:center;padding:0 16px;flex-shrink:0">
          <span style="font-size:20px;font-weight:900;color:${cfg.numText}">${String(i + 1).padStart(2, '0')}</span>
        </div>
        <div style="flex:1;padding:18px 20px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px">
            <span style="display:inline-flex;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;background:${cfg.badgeBg};color:#fff">${cfg.label}</span>
            <span style="font-size:11px;font-weight:600;color:#4b5563;background:#f3f4f6;padding:2px 10px;border-radius:99px">${item.section}</span>
          </div>
          <div style="background:${cfg.issueBg};border:1px solid ${cfg.issueBorder};border-radius:8px;padding:10px 14px;margin-bottom:10px">
            <p style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 4px">发现问题</p>
            <p style="font-size:13px;color:${cfg.issueText};margin:0;line-height:1.6">${item.issue}</p>
          </div>
          <div style="display:flex;align-items:flex-start;gap:8px">
            <span style="flex-shrink:0;width:18px;height:18px;border-radius:99px;background:#eff6ff;display:inline-flex;align-items:center;justify-content:center;margin-top:2px;font-size:10px;color:#2563eb">→</span>
            <p style="font-size:13px;color:#374151;margin:0;line-height:1.6;flex:1">${item.suggestion}</p>
          </div>
        </div>
      </div>`;
  }).join('');

  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:14px 16px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
      <p style="font-size:13px;color:#4b5563;margin:0">
        共 <strong style="color:#1e293b">${sorted.length}</strong> 条优化建议
        ${highCount > 0 ? `，其中 <strong style="color:#dc2626">${highCount}</strong> 条高优先级建议直接影响初筛通过率` : ''}
      </p>
    </div>
    ${cards}`;
}

function buildRewriteTab(rewrittenResume) {
  const resumeHtml = md2html(rewrittenResume || '');
  return `<div class="resume-prose">${resumeHtml}</div>`;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    background: #f8fafc; color: #374151; line-height: 1.6;
  }
  /* ── Header ── */
  .report-header {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e3a5f 100%);
    padding: 28px 32px 48px; color: white;
  }
  .report-title { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
  .report-jd { font-size: 13px; color: #94a3b8; max-width: 560px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .score-hero { font-size: 64px; font-weight: 900; line-height: 1; }
  .header-stats { display: flex; gap: 28px; margin-top: 8px; }
  .stat-item { text-align: center; }
  .stat-val { font-size: 22px; font-weight: 700; }
  .stat-label { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  /* ── Tab Bar ── */
  .tab-bar {
    display: flex; gap: 4px; padding: 12px 16px; border-bottom: 1px solid #f1f5f9;
    background: #f9fafb; position: sticky; top: 0; z-index: 10;
  }
  .tab-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 8px; border: none; cursor: pointer;
    font-size: 13px; font-weight: 500; font-family: inherit;
    background: transparent; color: #6b7280; transition: all 0.15s;
  }
  .tab-btn:hover { background: rgba(255,255,255,0.8); color: #1e293b; }
  .tab-btn.active { background: white; color: #1d4ed8; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .tab-count {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 18px; height: 18px; padding: 0 4px; border-radius: 99px;
    font-size: 11px; font-weight: 700; background: #dbeafe; color: #1d4ed8;
  }
  .tab-count.red { background: #ef4444; color: white; }
  /* ── Tab Panels ── */
  .tab-panel { display: none; padding: 28px 32px; }
  .tab-panel.active { display: block; }
  /* ── Card wrapper ── */
  .card-wrap { max-width: 960px; margin: 0 auto; }
  .content-card { background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid #f1f5f9; overflow: hidden; }
  /* ── Resume prose ── */
  .resume-prose { padding: 36px 48px; color: #374151; line-height: 1.75; }
  .resume-prose h1 { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; padding-bottom: 10px; border-bottom: 2px solid #2563eb; }
  .resume-prose h2 { font-size: 1rem; font-weight: 700; color: #1e40af; margin-top: 28px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; }
  .resume-prose h2::before { content: ''; display: inline-block; width: 3px; height: 1em; background: linear-gradient(to bottom, #3b82f6, #6366f1); border-radius: 2px; flex-shrink: 0; }
  .resume-prose h3 { font-size: 0.9rem; font-weight: 700; color: #1e293b; margin-top: 16px; margin-bottom: 4px; }
  .resume-prose p { color: #475569; font-size: 0.875rem; line-height: 1.75; margin-bottom: 6px; }
  .resume-prose ul { padding-left: 20px; margin-bottom: 8px; }
  .resume-prose li { color: #475569; font-size: 0.875rem; line-height: 1.75; margin-bottom: 2px; list-style-type: disc; }
  .resume-prose strong { color: #0f172a; font-weight: 700; }
  .resume-prose em { color: #64748b; }
  .resume-prose hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
`;

// ─── Tab switching JS ─────────────────────────────────────────────────────────

const TAB_SCRIPT = `
  function switchTab(key) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === key));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.tab === key));
  }
`;

// ─── Main export function ─────────────────────────────────────────────────────

export function generateReportHTML(result, inputData) {
  const {
    matchScore = 0,
    scoreBreakdown = {},
    keywordAnalysis = {},
    suggestions = [],
    rewrittenResume = '',
  } = result || {};

  const { matched = [], missing = [], extra = [] } = keywordAnalysis;
  const highCount = suggestions.filter(s => s.priority === 'high').length;

  const c = scoreColor(matchScore);
  const jdPreview = (inputData?.jobDescription || '').slice(0, 120);

  const tabs = [
    { key: 'score',       label: '匹配评分',   count: null,            countRed: false },
    { key: 'keywords',    label: '关键词分析', count: matched.length,  countRed: false },
    { key: 'suggestions', label: '优化建议',   count: highCount || null, countRed: true },
    { key: 'rewrite',     label: 'AI 简历',    count: null,            countRed: false },
  ];

  const tabBar = tabs.map(t => {
    const badge = t.count != null
      ? `<span class="tab-count${t.countRed ? ' red' : ''}">${t.count}</span>` : '';
    const active = t.key === 'score' ? ' active' : '';
    return `<button class="tab-btn${active}" data-tab="${t.key}" onclick="switchTab('${t.key}')">${t.label}${badge}</button>`;
  }).join('\n');

  const panels = [
    { key: 'score',       html: buildScoreTab(matchScore, scoreBreakdown) },
    { key: 'keywords',    html: buildKeywordsTab(matched, missing, extra) },
    { key: 'suggestions', html: buildSuggestionsTab(suggestions) },
    { key: 'rewrite',     html: buildRewriteTab(rewrittenResume) },
  ].map(({ key, html }) => {
    const active = key === 'score' ? ' active' : '';
    return `<div class="tab-panel${active}" data-tab="${key}"><div class="card-wrap"><div class="content-card">${html}</div></div></div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>AI 简历分析报告</title>
  <style>${STYLES}</style>
</head>
<body>

  <div class="report-header">
    <div class="card-wrap" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:24px">
      <div>
        <div class="report-title">AI 简历分析报告</div>
        ${jdPreview ? `<div class="report-jd">目标职位 · ${jdPreview}${jdPreview.length >= 120 ? '…' : ''}</div>` : ''}
        <div class="header-stats" style="margin-top:20px">
          <div class="stat-item"><div class="stat-val" style="color:#34d399">${matched.length}</div><div class="stat-label">关键词命中</div></div>
          <div style="width:1px;background:rgba(255,255,255,0.1)"></div>
          <div class="stat-item"><div class="stat-val" style="color:#f87171">${missing.length}</div><div class="stat-label">关键词缺失</div></div>
          <div style="width:1px;background:rgba(255,255,255,0.1)"></div>
          <div class="stat-item"><div class="stat-val" style="color:#fbbf24">${suggestions.length}</div><div class="stat-label">优化建议</div></div>
        </div>
      </div>
      <div style="text-align:center">
        <div class="score-hero" style="color:${c.text}">${matchScore}</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px;letter-spacing:0.1em">综合评分</div>
        <div style="margin-top:8px;display:inline-flex;padding:3px 12px;border-radius:99px;font-size:12px;font-weight:600;background:${c.stroke}22;color:${c.stroke};border:1px solid ${c.stroke}44">${c.label}</div>
      </div>
    </div>
  </div>

  <div style="max-width:960px;margin:0 auto;margin-top:-20px;padding:0 16px">
    <div class="content-card">
      <div class="tab-bar">${tabBar}</div>
      ${panels}
    </div>
  </div>

  <div style="text-align:center;padding:32px 0;font-size:12px;color:#94a3b8">
    由 AI 简历优化助手生成 · ${new Date().toLocaleDateString('zh-CN')}
  </div>

  <script>${TAB_SCRIPT}</script>
</body>
</html>`;
}

export function downloadReportHTML(result, inputData) {
  const html = generateReportHTML(result, inputData);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'AI简历分析报告.html';
  a.click();
  URL.revokeObjectURL(url);
}
