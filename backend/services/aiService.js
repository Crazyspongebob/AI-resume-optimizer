'use strict';

const OpenAI = require('openai');
const { SYSTEM_PROMPT, buildUserPrompt } = require('../prompts/resumePrompt');

// ---------------------------------------------------------------------------
// 多 AI 提供商配置（按顺序尝试）
// ---------------------------------------------------------------------------
function getProviders() {
  return [
    {
      name: 'ZAI GLM-4.7',
      apiKey: process.env.ZAI_API_KEY || '',
      baseURL: process.env.ZAI_BASE_URL || 'https://open.bigmodel.cn/api/coding/paas/v4',
      model: 'glm-4.7',
    },
    {
      name: 'ZAI GLM-4.5-Air',
      apiKey: process.env.ZAI_API_KEY || '',
      baseURL: process.env.ZAI_BASE_URL || 'https://open.bigmodel.cn/api/coding/paas/v4',
      model: 'glm-4.5-air',
    },
    {
      name: 'AIPing Kimi-K2.5',
      apiKey: process.env.AIPING_API_KEY || '',
      baseURL: process.env.AIPING_BASE_URL || 'https://aiping.cn/api/v1',
      model: 'kimi-k2.5',
    },
    {
      name: 'AIPing MiniMax-M2.5',
      apiKey: process.env.AIPING_API_KEY || '',
      baseURL: process.env.AIPING_BASE_URL || 'https://aiping.cn/api/v1',
      model: 'MiniMax-M2.5',
    },
    {
      name: 'Paratera GLM-5',
      apiKey: process.env.PARATERA_API_KEY || '',
      baseURL: process.env.PARATERA_BASE_URL || 'https://llmapi.paratera.com',
      model: 'GLM-5',
    },
    {
      name: 'Paratera DeepSeek-V3.2',
      apiKey: process.env.PARATERA_API_KEY || '',
      baseURL: process.env.PARATERA_BASE_URL || 'https://llmapi.paratera.com',
      model: 'DeepSeek-V3.2',
    },
  ];
}

// ---------------------------------------------------------------------------
// Mock data returned when DEMO_MODE=true
// ---------------------------------------------------------------------------
const MOCK_RESULT = {
  matchScore: 78,
  scoreBreakdown: {
    skillMatch: 82,
    experienceMatch: 75,
    educationMatch: 90,
    overallFit: 78,
  },
  keywordAnalysis: {
    matched: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Git', 'REST API', 'Webpack'],
    missing: ['Redux', 'GraphQL', 'Docker', 'CI/CD'],
    extra: ['Vue2', 'jQuery', '小程序开发', 'PHP'],
  },
  suggestions: [
    {
      section: '技能清单',
      issue: '缺少Redux和GraphQL等现代前端状态管理与数据查询技术',
      suggestion: '建议补充Redux / Zustand状态管理经验，并学习GraphQL基础，可通过个人项目展示相关能力',
      priority: 'high',
    },
    {
      section: '工作经历',
      issue: '工作成果描述较为模糊，缺少量化数据支撑',
      suggestion: '在每段工作经历中添加具体数字，如"将页面首屏加载时间从3.2s优化至1.1s，提升65%"，增强说服力',
      priority: 'high',
    },
    {
      section: '项目经历',
      issue: '未体现CI/CD和Docker容器化部署经验，而JD明确要求DevOps意识',
      suggestion: '如有接触过Jenkins、GitHub Actions或Docker，建议在项目描述中加入相关实践；若暂无经验可通过个人项目补充',
      priority: 'medium',
    },
    {
      section: '个人简介',
      issue: '开头摘要过于通用，未突出与岗位的核心匹配点',
      suggestion: '将个人简介改写为针对该职位的定向摘要，突出"3年React全栈开发经验"及核心业务价值',
      priority: 'medium',
    },
    {
      section: '教育背景',
      issue: '仅列出学历，未补充与技术相关的课程或竞赛获奖',
      suggestion: '可补充相关课程（数据结构、算法、计算机网络）或LeetCode刷题成绩、技术竞赛经历，增强技术背景可信度',
      priority: 'low',
    },
  ],
  rewrittenResume: `# 张伟
**前端开发工程师** | 186-0000-0000 | zhangwei@example.com | GitHub: github.com/zhangwei

## 个人简介
拥有3年React生态前端开发经验，熟练掌握TypeScript、Node.js全栈技术栈。主导过多个中大型Web应用的架构设计与性能优化，具备良好的工程化意识。积极学习Redux状态管理与GraphQL，致力于构建高性能、可维护的现代前端应用。

## 技能清单
- **前端框架**: React 18、TypeScript、JavaScript (ES2022)
- **状态管理**: Redux Toolkit、React Context API（学习中：Zustand）
- **工程化工具**: Webpack 5、Vite、ESLint、Prettier、Git / GitHub
- **后端技术**: Node.js、Express、REST API 设计
- **其他**: 微信小程序、Vue 2、响应式布局、性能优化

## 工作经历

### 前端开发工程师 | 某科技有限公司 | 2022.07 – 至今
- 主导公司核心SaaS管理平台从Vue2迁移至React + TypeScript，迁移后Bug率下降40%，开发效率提升30%
- 优化首屏加载性能，通过代码分割与懒加载将首屏时间从3.2s压缩至1.1s（提升65%）
- 封装通用组件库（含30+组件），被3个业务团队复用，减少重复开发工时约20%/月
- 参与后端Node.js接口开发，完成用户权限模块的前后端全链路实现

### 初级前端开发工程师 | 某互联网公司 | 2021.06 – 2022.06
- 独立完成3个微信小程序需求的开发与上线，累计用户超10万
- 使用Webpack优化构建配置，打包体积减少28%

## 项目经历

### 企业数字化协作平台（React + TypeScript + Node.js）
- 负责前端架构设计，采用模块联邦实现微前端拆分，支持多团队并行开发
- 引入React Query实现服务端状态管理，接口缓存命中率达85%，减少无效请求
- 编写单元测试（Jest + Testing Library），核心模块测试覆盖率达75%

## 教育背景
**计算机科学与技术 本科** | 某重点大学 | 2017.09 – 2021.06
- 主修课程：数据结构与算法、计算机网络、操作系统、数据库原理
`,
};

// ---------------------------------------------------------------------------
// Utility: extract JSON from a string that may be wrapped in markdown fences
// ---------------------------------------------------------------------------
function extractJSON(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('AI returned empty or non-string response');
  }

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  const fenceRegex = /```(?:json)?\s*([\s\S]*?)```/i;
  const fenceMatch = text.match(fenceRegex);
  const candidate = fenceMatch ? fenceMatch[1].trim() : text.trim();

  // Find the outermost JSON object
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Could not locate JSON object in AI response. Raw text (first 500 chars): ${text.slice(0, 500)}`);
  }

  const jsonString = candidate.slice(start, end + 1);

  // Pre-sanitize: escape bare control characters (newline, CR, tab) that appear
  // inside JSON string values. The AI often inserts literal newlines inside strings,
  // which JSON.parse rejects. We scan character-by-character, tracking whether we
  // are inside a quoted string, and escape any bare control characters we encounter.
  function sanitizeControlChars(s) {
    let result = '';
    let inString = false;
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (inString) {
        if (ch === '\\') {
          // Escaped sequence — copy both chars verbatim
          result += ch + (s[i + 1] || '');
          i += 2;
          continue;
        } else if (ch === '"') {
          inString = false;
          result += ch;
        } else if (ch === '\n') {
          result += '\\n';
        } else if (ch === '\r') {
          result += '\\r';
        } else if (ch === '\t') {
          result += '\\t';
        } else {
          result += ch;
        }
      } else {
        if (ch === '"') inString = true;
        result += ch;
      }
      i++;
    }
    return result;
  }

  try {
    return JSON.parse(sanitizeControlChars(jsonString));
  } catch (parseErr) {
    throw new Error(`JSON parse failed: ${parseErr.message}. Extracted string (first 500 chars): ${jsonString.slice(0, 500)}`);
  }
}

// ---------------------------------------------------------------------------
// Core function: call a single provider
// ---------------------------------------------------------------------------
async function callProvider(provider, userPrompt) {
  const client = new OpenAI({
    apiKey: provider.apiKey,
    baseURL: provider.baseURL,
  });
  const response = await client.chat.completions.create({
    model: provider.model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 8192,
  });

  const choice = response.choices?.[0];
  const content = choice?.message?.content;
  if (!content) {
    throw new Error(`Model ${provider.model} returned no content`);
  }

  // If the model stopped because it hit the token limit, the JSON will be
  // truncated and unparseable. Treat this as a provider failure so the
  // fallback chain can try the next provider.
  if (choice.finish_reason === 'length') {
    throw new Error(`Model ${provider.model} hit token limit (finish_reason=length) — response truncated`);
  }

  return content;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Analyzes a resume against a job description using the configured AI provider.
 * Returns a structured result object matching the required schema.
 *
 * @param {string} resume - Plain-text or Markdown resume content.
 * @param {string} jobDescription - Plain-text job description.
 * @returns {Promise<object>} Parsed analysis result.
 */
async function analyzeResume(resume, jobDescription) {
  // Short-circuit in demo mode
  if (process.env.DEMO_MODE === 'true') {
    console.log('[aiService] DEMO_MODE is enabled — returning mock data');
    return MOCK_RESULT;
  }

  const userPrompt = buildUserPrompt(resume, jobDescription);
  const providers = getProviders();

  let rawText;
  let lastError;
  for (const provider of providers) {
    try {
      console.log(`[aiService] 尝试调用: ${provider.name}`);
      rawText = await callProvider(provider, userPrompt);
      console.log(`[aiService] ${provider.name} 调用成功`);
      break;
    } catch (err) {
      console.warn(`[aiService] ${provider.name} 失败: ${err.message}`);
      lastError = err;
    }
  }
  if (!rawText) {
    throw new Error(`所有AI服务提供商均不可用。最后错误: ${lastError?.message}`);
  }

  console.log('[aiService] AI response received, parsing JSON...');
  const parsed = extractJSON(rawText);

  // Basic structural validation
  if (typeof parsed.matchScore !== 'number') {
    throw new Error('AI response missing required field: matchScore');
  }
  if (!parsed.scoreBreakdown || !parsed.keywordAnalysis || !Array.isArray(parsed.suggestions)) {
    throw new Error('AI response is missing required top-level fields');
  }
  if (parsed.suggestions.length === 0) {
    // Zero suggestions is technically valid for a near-perfect resume; allow it.
    console.warn('[aiService] AI returned 0 suggestions — resume may be an excellent match.');
  }

  return parsed;
}

module.exports = { analyzeResume };
