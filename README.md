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
| **导出** | 复制 Markdown、下载 HTML、打印/保存 PDF、导出含全部标签页的完整报告 |
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
# 填入任意一个 OpenAI 兼容的 AI 服务商 Key
ZAI_BASE_URL=https://open.bigmodel.cn/api/coding/paas/v4
ZAI_API_KEY=your_key_here

AIPING_BASE_URL=https://aiping.cn/api/v1
AIPING_API_KEY=your_key_here

PORT=3001
DEMO_MODE=false
```

> `.env` 已被 `.gitignore` 排除，不会提交到 Git。

### 启动

```bash
npm start             # 同时启动前后端（推荐）
npm run dev:backend   # 仅后端  http://localhost:3001
npm run dev:frontend  # 仅前端  http://localhost:5173
```

### 演示模式（无需 API）

```bash
npm run demo
```

后端直接返回预设数据，无需消耗 API 额度。

---

## 项目结构

```
ai-resume-optimizer/
├── backend/
│   ├── server.js                   # 入口
│   ├── routes/analyze.js           # POST /api/analyze  GET /api/demo-data  GET /api/health
│   ├── services/
│   │   ├── aiService.js            # AI 调用（多供应商 fallback）
│   │   └── pdfService.js           # PDF 文本提取
│   ├── prompts/resumePrompt.js     # 系统提示词与结构化输出 schema
│   └── middleware/errorHandler.js
│
├── frontend/src/
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── InputPage.jsx           # 简历 + JD 输入，支持 PDF 上传
│   │   └── ResultPage.jsx          # 四标签页结果 + 导出按钮
│   ├── components/
│   │   ├── ScoreGauge.jsx          # 评分环形图 + 分项得分卡
│   │   ├── KeywordAnalysis.jsx
│   │   ├── SuggestionList.jsx
│   │   ├── RewrittenResume.jsx     # 复制 / HTML / PDF 导出
│   │   └── ResultTabs.jsx
│   └── utils/
│       ├── demoData.js
│       └── exportReport.js         # 完整报告 HTML 生成器
│
├── .env.example
├── .gitignore
└── package.json                    # 根级脚本
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
| AI 接入 | OpenAI 兼容 SDK，支持多供应商 fallback |
| PDF 解析 | pdf-parse |

---

## 📄 License

MIT — feel free to fork and adapt for your own interview practice tools.
