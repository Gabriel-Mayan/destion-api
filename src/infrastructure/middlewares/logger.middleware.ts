import { Request, Response, NextFunction } from 'express';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

function formatBytes(bytes: number): string {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  const format = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (bytes < KB) return `${bytes} B`;
  else if (bytes < MB) return `${format.format(bytes / KB)} KB`;
  else if (bytes < GB) return `${format.format(bytes / MB)} MB`;
  else return `${format.format(bytes / GB)} GB`;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger: Logger;
  
  constructor() {
    this.logger = new Logger(LoggerMiddleware.name);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      if (req.method === 'GET' && req.url.startsWith('/ping')) return;

      const duration = Date.now() - start;
      const body = req.body || {};
      const bytes = Buffer.byteLength(JSON.stringify(body));
      const reqSize = formatBytes(bytes);

      this.logger.verbose(`${res.statusCode} ${req.method} ${req.url} ${duration}ms ${req.ip} ${reqSize}`)
    });

    next();
  }
}
