/**
 * AI 简历优化助手 —— Prompt 库
 * AI Resume Optimizer — Prompt Library
 *
 * 使用方式：
 *   import { SYSTEM_PROMPT, buildAnalysisPrompt, STRUCTURED_OUTPUT_SCHEMA, EXAMPLE_OUTPUT } from './prompts.js'
 */

// ─────────────────────────────────────────────
// 1. 系统提示词 (System Prompt)
// ─────────────────────────────────────────────

export const SYSTEM_PROMPT = `你是一位拥有15年经验的资深HR顾问与简历优化专家，曾服务于字节跳动、阿里巴巴、腾讯、美团等头部互联网公司的招聘团队。你对各技术岗位（前端、后端、数据、产品、设计等）的岗位要求、行业标准和求职趋势有深入理解。

你的核心职责是：
1. 精准分析候选人简历与目标职位描述（JD）的匹配程度
2. 识别简历中的关键词缺失、经历亮点不足、表述不清晰等问题
3. 给出专业、可落地的简历优化建议
4. 按照 JD 导向重写简历，帮助候选人显著提升面试邀约率

分析原则：
- 以 JD 为核心锚点，所有分析和建议必须服务于"提高与该 JD 的匹配度"
- 评分要客观公正，避免虚高或虚低
- 建议要具体可操作，给出"改成什么"而不仅是"要改"
- 重写简历时保持真实性，不捏造候选人没有的经历，但可以重新组织语言、调整侧重点
- 输出格式必须严格遵守 JSON Schema，确保下游系统可解析

请始终以 JSON 格式输出，不要包含任何 Markdown 代码块包装（不要用 \`\`\`json ... \`\`\`），直接输出纯 JSON 对象。`;


// ─────────────────────────────────────────────
// 2. 分析请求构建函数 (Analysis Prompt Builder)
// ─────────────────────────────────────────────

/**
 * 构建简历分析的完整用户提示词
 * @param {string} resume       - 候选人的原始简历文本（从 Word/PDF 粘贴的纯文本格式）
 * @param {string} jobDescription - 目标职位的 JD 文本
 * @returns {string}            - 完整的用户侧 Prompt
 */
export function buildAnalysisPrompt(resume, jobDescription) {
  return `请按照以下步骤，对候选人简历与目标职位描述（JD）进行深度分析，并严格按照指定的 JSON 格式输出结果。

## 目标职位描述（JD）

${jobDescription}

---

## 候选人简历

${resume}

---

## 分析步骤（请按顺序思考，但只输出最终 JSON）

### 第一步：关键词提取与对比
1. 从 JD 中提取所有技术关键词、能力关键词、工具关键词（例如：React、A/B测试、微前端、Figma 等）
2. 从简历中提取相同维度的关键词
3. 分类归纳：
   - matched（匹配）：简历中出现的 JD 关键词
   - missing（缺失）：JD 要求但简历完全未提及的关键词
   - extra（额外）：简历有但 JD 未提及的关键词（可能是噪音也可能是差异化优势）

### 第二步：多维度评分
对以下四个维度逐一评分（0-100分），并说明理由（仅供内部推理，不输出到 JSON）：
- skillMatch（技能匹配度）：核心技能与工具的覆盖程度
- experienceMatch（经验匹配度）：年限、业务场景、项目规模与 JD 要求的契合程度
- educationMatch（学历匹配度）：学历背景与 JD 要求的符合程度
- overallFit（综合匹配度）：综合上述三维 + 软技能/行业背景的整体评估

matchScore 为 overallFit 的最终分值。

### 第三步：优化建议
针对简历存在的问题，按优先级（high / medium / low）给出 3-6 条具体、可操作的建议。每条建议需指明：
- section：问题所在模块（如「工作经历」「专业技能」「个人简介」「项目经历」等）
- issue：当前问题的具体描述
- suggestion：明确的优化建议（给出修改后的示例文字更佳）
- priority：优先级 —— "high"（直接影响是否通过 ATS 或 HR 初筛）/ "medium"（提升印象分）/ "low"（锦上添花）

### 第四步：简历重写
以 JD 为导向，对原始简历进行全面重写：
- 保留候选人真实经历，重新组织语言，突出与 JD 最相关的内容
- 将缺失关键词（如候选人确有相关经历但表述不当）融入自然语境
- 量化数据要具体（使用加粗 **数字** 格式）
- 使用 Markdown 格式输出，包含标题、分隔线、表格等结构
- 简历篇幅控制在 600-900 字之间

---

## 输出格式要求

严格按照以下 JSON Schema 输出，不要输出任何 JSON 以外的内容：

\`\`\`
{
  "matchScore": <number, 0-100>,
  "scoreBreakdown": {
    "skillMatch": <number, 0-100>,
    "experienceMatch": <number, 0-100>,
    "educationMatch": <number, 0-100>,
    "overallFit": <number, 0-100>
  },
  "keywordAnalysis": {
    "matched": [<string>, ...],
    "missing": [<string>, ...],
    "extra": [<string>, ...]
  },
  "suggestions": [
    {
      "section": <string>,
      "issue": <string>,
      "suggestion": <string>,
      "priority": <"high" | "medium" | "low">
    },
    ...
  ],
  "rewrittenResume": <string, Markdown格式的完整重写简历>
}
\`\`\`

---

## 参考示例输出

${JSON.stringify(EXAMPLE_OUTPUT, null, 2)}

---

请现在开始分析，直接输出 JSON，不要有任何前置说明文字。`;
}


// ─────────────────────────────────────────────
// 3. 结构化输出 JSON Schema
// ─────────────────────────────────────────────

export const STRUCTURED_OUTPUT_SCHEMA = {
  type: "object",
  required: [
    "matchScore",
    "scoreBreakdown",
    "keywordAnalysis",
    "suggestions",
    "rewrittenResume"
  ],
  properties: {
    matchScore: {
      type: "number",
      minimum: 0,
      maximum: 100,
      description: "简历与 JD 的综合匹配分数（0-100），等同于 scoreBreakdown.overallFit"
    },
    scoreBreakdown: {
      type: "object",
      required: ["skillMatch", "experienceMatch", "educationMatch", "overallFit"],
      properties: {
        skillMatch: {
          type: "number",
          minimum: 0,
          maximum: 100,
          description: "技能与工具的匹配程度评分"
        },
        experienceMatch: {
          type: "number",
          minimum: 0,
          maximum: 100,
          description: "工作年限、项目规模、业务场景与 JD 的契合度评分"
        },
        educationMatch: {
          type: "number",
          minimum: 0,
          maximum: 100,
          description: "学历、专业背景与 JD 要求的符合程度评分"
        },
        overallFit: {
          type: "number",
          minimum: 0,
          maximum: 100,
          description: "综合所有维度的整体匹配度评分，即 matchScore 的来源"
        }
      },
      additionalProperties: false
    },
    keywordAnalysis: {
      type: "object",
      required: ["matched", "missing", "extra"],
      properties: {
        matched: {
          type: "array",
          items: { type: "string" },
          description: "简历中出现的 JD 关键词列表"
        },
        missing: {
          type: "array",
          items: { type: "string" },
          description: "JD 要求但简历中完全未提及的关键词列表"
        },
        extra: {
          type: "array",
          items: { type: "string" },
          description: "简历中有但 JD 未提及的额外关键词（可能是优势也可能是噪音）"
        }
      },
      additionalProperties: false
    },
    suggestions: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: {
        type: "object",
        required: ["section", "issue", "suggestion", "priority"],
        properties: {
          section: {
            type: "string",
            description: "问题所在的简历模块，如「工作经历」「专业技能」「个人简介」「项目经历」等"
          },
          issue: {
            type: "string",
            description: "当前简历在该模块存在的具体问题描述"
          },
          suggestion: {
            type: "string",
            description: "具体可操作的优化建议，最好包含修改示例"
          },
          priority: {
            type: "string",
            enum: ["high", "medium", "low"],
            description: "优先级：high=影响初筛 / medium=提升印象分 / low=锦上添花"
          }
        },
        additionalProperties: false
      },
      description: "简历优化建议列表，按 priority 由高到低排列"
    },
    rewrittenResume: {
      type: "string",
      description: "以 JD 为导向，Markdown 格式的完整重写简历文本，保留真实经历但优化措辞与侧重点"
    }
  },
  additionalProperties: false
};


// ─────────────────────────────────────────────
// 4. 示例输出 (Few-shot Example)
// ─────────────────────────────────────────────

export const EXAMPLE_OUTPUT = {
  matchScore: 82,
  scoreBreakdown: {
    skillMatch: 85,
    experienceMatch: 80,
    educationMatch: 88,
    overallFit: 82
  },
  keywordAnalysis: {
    matched: [
      "React", "TypeScript", "性能优化", "工程化", "Webpack",
      "Node.js", "代码规范", "组件化"
    ],
    missing: [
      "微前端", "SSR", "BFF", "电商平台经验"
    ],
    extra: [
      "uni-app", "Vue 2", "Jest", "开源项目"
    ]
  },
  suggestions: [
    {
      section: "工作经历",
      issue: "未体现微前端架构相关经验，而 JD 明确将微前端列为加分项",
      suggestion: "若有任何相关实践或调研，可补充：「了解微前端架构（qiankun/Module Federation），参与过子应用接入方案的技术评估与 POC 验证」",
      priority: "high"
    },
    {
      section: "专业技能",
      issue: "Next.js 描述为「了解」，与 JD 强调的 SSR/BFF 经验有明显差距",
      suggestion: "如有 SSR 相关实践经历，具体化描述：「调研 Next.js SSR 方案并输出评估报告，为团队页面渲染策略选型提供参考依据」",
      priority: "medium"
    },
    {
      section: "个人简介",
      issue: "简历缺少个人简介模块，HR 无法在 5 秒内快速了解候选人核心价值",
      suggestion: "在姓名联系方式后新增 2-3 行简介：「4 年前端开发经验，专注 React 技术栈，主导过亿级用户平台的性能优化与工程化建设，有开源项目贡献经验（GitHub Stars 1.2k）」",
      priority: "medium"
    }
  ],
  rewrittenResume: "# 张三 · 高级前端工程师\n\n📞 138-0000-0000 | 📧 zhangsan@example.com | 上海·浦东新区\n\n## 个人简介\n4 年前端开发经验，专注 React + TypeScript 技术栈，主导亿级用户平台的性能优化（LCP 提升 57%）与工程化建设。开源项目 GitHub Stars 1.2k+，具备微前端方案调研经验。\n\n## 工作经历\n\n### 某科技公司 · 前端开发工程师 · 2021.07 – 至今\n\n- **性能优化**：主导 Webpack 5 → Vite 迁移，首屏 LCP 从 4.2s 降至 **1.8s（↓57%）**，三项 Core Web Vitals 均达 Good 级别\n- **微前端调研**：评估 qiankun / Module Federation 方案，完成 POC 验证，输出技术选型报告\n- **工程规范**：推动 ESLint + Prettier + Husky 代码质量卡口落地，团队 CR 通过率提升至 95%\n\n## 专业技能\n\n| 类别 | 技能 |\n|------|------|\n| 框架 | React 18（精通）、Vue 2/3（熟练）、Next.js SSR（了解） |\n| 工程化 | Webpack 5、Vite、Babel、ESLint |\n| 性能 | Web Vitals 调优、代码分割、Tree Shaking |\n\n## 荣誉\n- 2022 年度优秀员工"
};
