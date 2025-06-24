import { Transform, TransformCallback } from 'stream';

export const allowedExtensions = ['.ts', '.png', '.jpg', '.webp', '.ico', '.html', '.js', '.css', '.txt'];

export class LineTransform extends Transform {
  private buffer: string;
  private baseUrl: string
  private pathname: string

  constructor(baseUrl: string, pathname: string) {
    super();
    this.buffer = '';
    this.baseUrl = baseUrl
    this.pathname = pathname
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

    if (line.startsWith("/?u")) {
      // https://g9uxp3w0zlkrt4su.xelvonwave64.xyz
      return `m3u8-proxy?url=${encodeURIComponent(`${this.baseUrl}${line}`)}&play=true`;
    }

    if (line.startsWith("ey")) {
      return `m3u8-proxy?url=${encodeURIComponent(`${this.baseUrl}/${line}`)}`;
    }

    if (line.includes('URI="ey')) {
      line = line.replace(
        /URI="(ey[^"]+\.m3u8)"/g,
        (_, uri) =>
          uri.endsWith(".m3u8") && `URI="m3u8-proxy?url=${encodeURIComponent(`${this.baseUrl}/${uri}`)}"`
      );
      return line;
    }

    if (line.startsWith("./") && line.endsWith(".m3u8")) {
      const editedPathname = this.pathname.replace("/index.m3u8", "")
      return `m3u8-proxy?url=${`${this.baseUrl}${editedPathname}${line.replace(".", "")}`}`
    }

    if (line.startsWith('http') && !line.endsWith('m3u8')) {
      return `m3u8-proxy?url=${encodeURIComponent(line)}&play=true`;
    }

    return line;
  }
}