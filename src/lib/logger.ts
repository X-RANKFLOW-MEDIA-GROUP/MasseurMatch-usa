/**
 * Structured Logging Utility
 *
 * Provides a consistent logging interface across the application.
 * In development, logs to console. In production, can be extended
 * to send logs to external services (Sentry, LogRocket, etc.).
 *
 * Usage:
 * ```ts
 * import { logger } from '@/src/lib/logger';
 *
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Failed to fetch data', error, { endpoint: '/api/users' });
 * logger.warn('Deprecated API usage', { method: 'oldMethod' });
 * ```
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
  environment: string;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.isProduction = process.env.NODE_ENV === "production";
  }

  /**
   * Format log entry for output
   */
  private formatLogEntry(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;

    if (this.isDevelopment) {
      // Pretty format for development
      let output = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

      if (context && Object.keys(context).length > 0) {
        output += `\nContext: ${JSON.stringify(context, null, 2)}`;
      }

      if (error) {
        output += `\nError: ${error.message}\n${error.stack}`;
      }

      return output;
    } else {
      // JSON format for production (easier to parse by log aggregators)
      return JSON.stringify(entry);
    }
  }

  /**
   * Send log to external service (production only)
   */
  private sendToExternalService(entry: LogEntry): void {
    if (!this.isProduction) return;

    // TODO: Integrate with error tracking service
    // Example: Sentry.captureMessage(entry.message, { level: entry.level, extra: entry.context });

    // For now, just ensure it doesn't fail silently
    try {
      // Placeholder for external logging service
      // Example: fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
    } catch (error) {
      // Don't let logging failures crash the app
      console.error("Failed to send log to external service:", error);
    }
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, errorOrContext?: Error | LogContext, context?: LogContext): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "unknown",
    };

    // Handle overloaded parameters
    if (errorOrContext instanceof Error) {
      entry.error = errorOrContext;
      entry.context = context;
    } else if (errorOrContext) {
      entry.context = errorOrContext;
    }

    // Console output
    const formattedLog = this.formatLogEntry(entry);

    switch (level) {
      case "debug":
        if (this.isDevelopment) {
          console.debug(formattedLog);
        }
        break;
      case "info":
        console.info(formattedLog);
        break;
      case "warn":
        console.warn(formattedLog);
        break;
      case "error":
        console.error(formattedLog);
        if (entry.error) {
          console.error(entry.error);
        }
        break;
    }

    // Send to external service if needed
    if (level === "error" || level === "warn") {
      this.sendToExternalService(entry);
    }
  }

  /**
   * Debug level logging (development only)
   */
  debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error | LogContext, context?: LogContext): void {
    this.log("error", message, error, context);
  }

  /**
   * Create a child logger with persistent context
   * Useful for adding component/module-specific context
   */
  child(defaultContext: LogContext): Logger {
    const childLogger = new Logger();
    const originalLog = childLogger.log.bind(childLogger);

    childLogger.log = (level: LogLevel, message: string, errorOrContext?: Error | LogContext, context?: LogContext) => {
      const mergedContext = {
        ...defaultContext,
        ...(errorOrContext instanceof Error ? context : errorOrContext),
      };

      originalLog(level, message, errorOrContext instanceof Error ? errorOrContext : undefined, mergedContext);
    };

    return childLogger;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for consumers
export type { LogLevel, LogContext };
