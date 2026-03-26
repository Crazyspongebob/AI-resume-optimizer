'use strict';

// pdf-parse v2 exports a class-based API: { PDFParse }
// v1 exported a callable function directly — guard against both shapes.
const pdfParseModule = require('pdf-parse');
const PDFParse = pdfParseModule.PDFParse || pdfParseModule;

/**
 * Extracts plain text from a PDF buffer.
 * Cleans up excessive whitespace that pdf-parse often produces.
 *
 * @param {Buffer} buffer - Raw PDF file buffer (e.g. from multer memoryStorage)
 * @returns {Promise<string>} Cleaned plain-text content of the PDF
 */
async function extractTextFromPDF(buffer) {
  let raw = '';

  if (typeof PDFParse === 'function' && PDFParse.prototype && typeof PDFParse.prototype.getText === 'function') {
    // pdf-parse v2: class-based API
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    raw = (result.pages || []).map(p => p.text || '').join('\n');
  } else {
    // pdf-parse v1: functional API — PDFParse(buffer) → { text }
    const data = await PDFParse(buffer);
    raw = data.text || '';
  }

  // Collapse runs of 3+ blank lines into a single blank line,
  // and trim lines that are purely whitespace.
  const cleaned = raw
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!cleaned || cleaned.length < 30) {
    throw new Error('PDF 内容无法提取或内容过少，请确保上传的是文本型 PDF（非扫描图片型）');
  }

  return cleaned;
}

module.exports = { extractTextFromPDF };
