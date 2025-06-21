import { Transform, TransformCallback } from 'stream';

export const allowedExtensions = ['.ts', '.png', '.jpg', '.webp', '.ico', '.html', '.js', '.css', '.txt'];

export class LineTransform extends Transform {
  private buffer: string;

  constructor() {
    super();
    this.buffer = '';
  }

  _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback) {
    const data = this.buffer + chunk.toString();
    const lines = data.split(/\r?\n/);
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      const modifiedLine = this.processLine(line);
      this.push(modifiedLine + '\n');
    }

    callback();
  }

  _flush(callback: TransformCallback) {
    if (this.buffer) {
      const modifiedLine = this.processLine(this.buffer);
      this.push(modifiedLine);
    }
    callback();
  }

  private processLine(line: string): string {
    if (line.startsWith("http") && line.endsWith(".m3u8")) {
      return `m3u8-proxy?url=${encodeURIComponent(line)}`;
    }

    if (line.startsWith('http') && !line.endsWith('m3u8')) {
      return `m3u8-proxy?url=${encodeURIComponent(line)}&play=true`;
    }

    return line;
  }
}