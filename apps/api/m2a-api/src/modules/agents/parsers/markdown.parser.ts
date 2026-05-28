// src/modules/agents/parsers/markdown.parser.ts
export class MarkdownParser {
  static parse(buffer: Buffer): { type: 'text'; text: string } {
    return {
      type: 'text',
      text: buffer.toString('utf-8'),
    };
  }
}
