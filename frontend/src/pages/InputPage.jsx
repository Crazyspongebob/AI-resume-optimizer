import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisContext } from '../AnalysisContext';
import useAnalysis from '../hooks/useAnalysis';
import { DEMO_RESUME, DEMO_JD } from '../utils/demoData';
import DemoButton from '../components/DemoButton';
import LoadingOverlay from '../components/LoadingOverlay';

export default function InputPage() {
  const navigate = useNavigate();
  const { setResult, setInputData } = useAnalysisContext();
  const { loading, analyze } = useAnalysis();

  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [errors, setErrors] = useState({});

  const handleDemo = () => {
    setResume(DEMO_RESUME);
    setJobDescription(DEMO_JD);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!resume.trim()) {
      newErrors.resume = '请输入简历内容';
    }
    if (!jobDescription.trim()) {
      newErrors.jobDescription = '请输入目标职位JD';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setInputData({ resume, jobDescription });

    const analysisResult = await analyze(resume, jobDescription);
    if (analysisResult) {
      setResult(analysisResult);
      navigate('/result');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {loading && <LoadingOverlay />}

      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">输入简历与职位信息</h1>
          <p className="text-gray-500">粘贴你的简历内容和目标职位描述，AI 将为你进行深度匹配分析</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Two-panel layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Panel: Resume */}
            <div className="card p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-base font-semibold text-gray-800" htmlFor="resume">
                  简历内容
                  <span className="ml-2 text-xs font-normal text-gray-400">（纯文本格式）</span>
                </label>
                {resume && (
                  <span className="text-xs text-gray-400">{resume.length} 字符</span>
                )}
              </div>
              <textarea
                id="resume"
                value={resume}
                onChange={(e) => {
                  setResume(e.target.value);
                  if (errors.resume) setErrors((prev) => ({ ...prev, resume: '' }));
                }}
                placeholder={`请粘贴你的简历内容，例如：\n\n姓名：张三\n邮箱：zhangsan@example.com\n\n工作经历：\n公司名称 | 职位名称 | 2022.01 - 至今\n- 负责产品功能规划与需求分析\n- 主导跨团队协作，推动项目按时交付\n\n教育背景：\n某某大学 | 计算机科学 | 本科 | 2018-2022\n\n技能：React、TypeScript、Node.js、项目管理`}
                className={`flex-1 min-h-[400px] w-full resize-none rounded-lg border text-sm text-gray-700 placeholder-gray-400 p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.resume ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
              />
              {errors.resume && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.resume}
                </p>
              )}
            </div>

            {/* Right Panel: Job Description */}
            <div className="card p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-base font-semibold text-gray-800" htmlFor="jobDescription">
                  目标职位 JD
                  <span className="ml-2 text-xs font-normal text-gray-400">（职位描述）</span>
                </label>
                {jobDescription && (
                  <span className="text-xs text-gray-400">{jobDescription.length} 字符</span>
                )}
              </div>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  if (errors.jobDescription) setErrors((prev) => ({ ...prev, jobDescription: '' }));
                }}
                placeholder={`请粘贴目标职位的招聘描述，例如：\n\n职位：高级前端工程师\n公司：某某科技有限公司\n\n职位描述：\n- 负责公司核心产品的前端开发与维护\n- 参与技术方案设计，推动前端工程化建设\n- 与产品、设计、后端协作，完成需求迭代\n\n职位要求：\n- 3年以上前端开发经验\n- 熟练掌握 React / Vue 等主流框架\n- 具备良好的沟通能力和团队合作精神\n- 有大型项目经验者优先`}
                className={`flex-1 min-h-[400px] w-full resize-none rounded-lg border text-sm text-gray-700 placeholder-gray-400 p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.jobDescription ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
              />
              {errors.jobDescription && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.jobDescription}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <DemoButton onClick={handleDemo} disabled={loading} />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-10 py-3 text-base font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  分析中，请稍候...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  开始 AI 分析
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            分析过程通常需要 10-30 秒，请耐心等待
          </p>
        </form>
      </div>
    </div>
  );
}
