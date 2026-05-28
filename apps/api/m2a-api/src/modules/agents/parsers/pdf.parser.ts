// src/modules/agents/parsers/pdf.parser.ts
export class PdfParser {
  static parse(buffer: Buffer): {
    type: 'inlineData';
    inlineData: { mimeType: string; data: string };
  } {
    return {
      type: 'inlineData',
      inlineData: {
        mimeType: 'application/pdf',
        data: buffer.toString('base64'),
      },
    };
  }
}
