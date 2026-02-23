import { prisma } from "./prisma";

type LogLevel = "info" | "warn" | "error";
type LogSource = "auth" | "api" | "mcp" | "system";

export async function appLog(
  level: LogLevel,
  source: LogSource,
  message: string,
  meta?: Record<string, unknown>,
  userId?: string,
) {
  try {
    await prisma.appLog.create({
      data: {
        level,
        source,
        message,
        meta: meta ? JSON.stringify(meta) : null,
        userId: userId || null,
      },
    });
  } catch {
    console.error(`[AppLog:${level}] ${source}: ${message}`);
  }
}
