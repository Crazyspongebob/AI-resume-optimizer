# AI 简历优化助手

AI 驱动的简历匹配分析与优化工具。上传简历和目标职位描述（JD），即可获得多维度匹配评分、关键词分析、优先级排列的优化建议，以及 AI 重写的优化版简历，并支持一键导出为 HTML / PDF。

---

## 功能特色

| 功能 | 描述 |
|------|------|
| **匹配评分** | 技能、经验、学历、综合契合四维加权评分（0–100） |
| **关键词分析** | 命中 / 缺失 / 额外技能标签可视化，覆盖率进度条 |
| **优化建议** | 高 / 中 / 低优先级建议卡片，定位具体问题与改进方向 |
| **AI 重写简历** | 基于 JD 自动重写，保留真实经历，优化措辞与侧重 |
| **导出** | 复制 Markdown、下载 HTML、打印/保存 PDF、导出完整四标签页报告 |
| **PDF 上传** | 支持上传 PDF 格式简历，后端自动提取文本 |
| **演示模式** | 无需 API Key 即可体验完整流程 |

---

## 快速开始

### 环境要求

- Node.js 18+
- npm 8+

### 安装依赖

```bash
npm run install:all
```

### 配置环境变量

复制 `.env.example` 为 `.env`，填入你的 API Key：

```bash
cp .env.example .env
```

`.env` 内容示例：

```env
# AI 服务商（选一个填入）
ZAI_BASE_URL=https://open.bigmodel.cn/api/coding/paas/v4
ZAI_API_KEY=your_key_here

AIPING_BASE_URL=https://aiping.cn/api/v1
AIPING_API_KEY=your_key_here

# 服务器
PORT=3001
DEMO_MODE=false
```

> **注意**：`.env` 已被 `.gitignore` 排除，不会提交到 Git。请勿将 API Key 硬编码在源码中。

### 启动

```bash
# 同时启动前后端（推荐）
npm start

# 或分开启动
npm run dev:backend    # 后端  http://localhost:3001
npm run dev:frontend   # 前端  http://localhost:5173
```

### 演示模式（无需 API）

```bash
npm run demo
```

后端直接返回预设数据，无需消耗 API 额度，适合 UI 演示。

---

## 项目结构

```
ai-resume-optimizer/
├── backend/                    # Express 后端
│   ├── server.js               # 入口，跨域、路由挂载
│   ├── routes/
│   │   └── analyze.js          # POST /api/analyze，GET /api/demo-data，GET /api/health
│   ├── services/
│   │   ├── aiService.js        # AI 调用（多供应商 fallback，JSON 解析）
│   │   └── pdfService.js       # PDF 文本提取（pdf-parse）
│   ├── prompts/
│   │   └── resumePrompt.js     # 系统提示词与结构化输出 schema
│   └── middleware/
│       └── errorHandler.js     # 统一错误处理
│
├── frontend/                   # React + Vite + Tailwind CSS 前端
│   └── src/
│       ├── main.jsx            # 应用入口
│       ├── App.jsx             # 路由（/ → /input → /result）
│       ├── AnalysisContext.jsx # 全局状态（result, inputData）
│       ├── pages/
│       │   ├── LandingPage.jsx # 首页
│       │   ├── InputPage.jsx   # 输入页（简历 + JD + PDF 上传）
│       │   └── ResultPage.jsx  # 结果页（四标签页 + 导出按钮）
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── ScoreGauge.jsx      # 评分环形图 + 分项得分卡
│       │   ├── KeywordAnalysis.jsx # 关键词覆盖分析
│       │   ├── SuggestionList.jsx  # 优化建议列表
│       │   ├── RewrittenResume.jsx # AI 简历（复制/HTML/PDF）
│       │   ├── ResultTabs.jsx      # 标签页切换
│       │   ├── LoadingOverlay.jsx  # 加载动画
│       │   └── DemoButton.jsx      # 演示模式触发
│       ├── hooks/
│       │   └── useAnalysis.js      # 分析请求逻辑
│       ├── services/
│       │   └── api.js              # fetch 封装
│       └── utils/
│           ├── demoData.js         # 演示数据
│           └── exportReport.js     # 完整报告 HTML 生成器
│
├── .env.example                # 环境变量模板
├── .gitignore
├── package.json                # 根级脚本（start / demo / install:all）
└── Q-folder/                   # 非生产文件（已加入 .gitignore）
    ├── openclaw.json           # AI 供应商配置（含 key，勿提交）
    ├── data/mock/              # 示例简历与分析结果
    ├── prompts/                # 独立提示词库（供参考）
    ├── benchmark.js            # 多供应商性能测速脚本
    ├── benchmark_output.txt
    ├── BENCHMARK_RESULTS.md
    ├── DEVELOPMENT_METHODOLOGY.md
    ├── DEMO_SCRIPT.md
    ├── logs.md
    └── ...
```

---

## API 接口

| 方法 | 路径 | 描述 |
|------|------|------|
| `POST` | `/api/analyze` | 分析简历；body: `{ resumeText, jobDescription }` |
| `POST` | `/api/parse-pdf` | 提取 PDF 文本；body: multipart `file` |
| `GET`  | `/api/demo-data` | 返回演示用分析结果 |
| `GET`  | `/api/health` | 健康检查 |

### `/api/analyze` 响应结构

```json
{
  "matchScore": 78,
  "scoreBreakdown": {
    "skillMatch": 82,
    "experienceMatch": 75,
    "educationMatch": 90,
    "overallFit": 70
  },
  "keywordAnalysis": {
    "matched": ["React", "TypeScript"],
    "missing": ["GraphQL", "Docker"],
    "extra":   ["Photoshop"]
  },
  "suggestions": [
    {
      "priority": "high",
      "section": "技能",
      "issue": "缺少 Docker 相关经验描述",
      "suggestion": "在技能栏补充容器化工具使用经验"
    }
  ],
  "rewrittenResume": "# 姓名\n..."
}
```

---

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 18, React Router 6, Tailwind CSS, Vite |
| 后端 | Node.js, Express 4 |
| AI 接入 | OpenAI-兼容 SDK，支持多供应商 fallback |
| PDF 解析 | pdf-parse |
| 样式 | Tailwind CSS + 自定义 CSS（resume-prose） |

### 支持的 AI 供应商

| 供应商 | 推荐模型 | 特点 |
|--------|----------|------|
| AIping | `kimi-k2.5` / `MiniMax-M2.5` | 稳定，速度快（主选） |
| 智谱官方 (ZAI) | `glm-4.5-air` / `glm-4.7` | 官方备选，深度分析 |
| Paratera | `glm-4-flash` | 备用 |

切换模型：修改 `backend/services/aiService.js` 中的供应商配置，或在 `.env` 中更换 `*_BASE_URL` / `*_API_KEY`。

> 建议定期运行 `Q-folder/benchmark.js` 测速，选出当前最快供应商。

---

## 安全说明

- `.env`（含 API Key）已加入 `.gitignore`，不会提交
- `Q-folder/`（含 `openclaw.json` 等配置）已加入 `.gitignore`，不会提交
- 请勿将任何 API Key 硬编码在 `src/` 或 `backend/` 源码中
