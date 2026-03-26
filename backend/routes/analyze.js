'use strict';

const express = require('express');
const { analyzeResume } = require('../services/aiService');

const router = express.Router();

// ---------------------------------------------------------------------------
// Demo data — realistic Chinese resume + JD example
// ---------------------------------------------------------------------------
const DEMO_RESUME = `张伟
电话：186-0000-0000  邮箱：zhangwei@example.com
GitHub：github.com/zhangwei  地址：北京市朝阳区

【教育背景】
计算机科学与技术  本科
某重点大学  2017.09 – 2021.06

【工作经历】
前端开发工程师 | 北京某科技有限公司 | 2022.07 – 至今
- 负责公司核心SaaS管理平台的前端开发与维护，技术栈为 React + JavaScript
- 参与将旧版 Vue2 项目迁移至 React，完成核心模块重构
- 封装通用组件库，提升团队开发效率
- 配合后端完成用户权限、数据报表等模块的接口联调

初级前端开发工程师 | 北京某互联网公司 | 2021.06 – 2022.06
- 独立完成3个微信小程序的开发与上线
- 使用 Webpack 优化项目构建配置，打包体积减少约 28%

【项目经历】
企业协作管理平台（React + Node.js）
- 参与前端架构设计，负责核心业务模块开发
- 使用 Webpack 进行工程化配置，支持多环境部署

【技能清单】
前端：React、JavaScript（ES6+）、HTML5、CSS3、Webpack、Git
后端：Node.js、Express、REST API
其他：微信小程序、Vue2、jQuery、PHP基础`;

const DEMO_JD = `职位：高级前端开发工程师
公司：某知名互联网公司（北京）
薪资：25k-35k  经验要求：3年以上

【岗位职责】
1. 负责公司核心Web产品的前端架构设计与核心功能开发
2. 推动前端工程化建设，制定编码规范与最佳实践
3. 优化前端性能，提升用户体验
4. 与产品、设计、后端紧密协作，推动项目高质量落地
5. 参与技术方案评审，指导初中级工程师

【任职要求】
1. 本科及以上学历，计算机相关专业
2. 3年以上前端开发经验，有大型项目经验者优先
3. 精通 React 生态，熟练使用 TypeScript
4. 熟悉 Redux / Zustand 等状态管理方案
5. 了解 GraphQL，有实际项目使用经验者优先
6. 熟悉 Webpack / Vite 等构建工具
7. 了解 Docker、CI/CD 等 DevOps 工具，具备工程化思维
8. 良好的代码风格，注重单元测试（Jest / Testing Library）
9. 良好的沟通能力与团队协作精神`;

// ---------------------------------------------------------------------------
// POST /api/analyze
// ---------------------------------------------------------------------------
router.post('/analyze', async (req, res, next) => {
  try {
    const { resume, jobDescription } = req.body;

    if (!resume || typeof resume !== 'string' || resume.trim().length === 0) {
      const err = new Error('请提供简历内容（resume 字段不能为空）');
      err.status = 400;
      return next(err);
    }
    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
      const err = new Error('请提供职位描述（jobDescription 字段不能为空）');
      err.status = 400;
      return next(err);
    }

    console.log(`[POST /analyze] resume length=${resume.length}, jd length=${jobDescription.length}`);

    const data = await analyzeResume(resume, jobDescription);

    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/demo-data
// ---------------------------------------------------------------------------
router.get('/demo-data', (req, res) => {
  res.json({
    success: true,
    data: {
      resume: DEMO_RESUME,
      jobDescription: DEMO_JD,
    },
  });
});

// ---------------------------------------------------------------------------
// GET /api/health
// ---------------------------------------------------------------------------
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    demoMode: process.env.DEMO_MODE === 'true',
    model: 'glm-4-flash',
  });
});

module.exports = router;
