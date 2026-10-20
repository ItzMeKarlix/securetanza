/**
 * Config Application Service (Polysyne Architecture)
 * Encapsulates export schedule queries behind CacheService.
 */

import { prisma } from '@/backend/lib/prisma';
import { cacheService, CacheKeys, TTL } from '@/backend/cache';

export class ConfigService {
  /**
   * Get user export schedule (5-minute cache)
   */
  public static async getExportSchedule(userId: number): Promise<any> {
    const cacheKey = CacheKeys.config.exportSchedule(userId);

    return cacheService.getOrSet(cacheKey, TTL.EXPORT_SCHEDULE, async () => {
      return prisma.exportSchedule.findFirst({
        where: { userId },
      });
    });
  }

  /**
   * Save user export schedule and invalidate user schedule cache
   */
  public static async saveExportSchedule(userId: number, data: any): Promise<any> {
    const existing = await prisma.exportSchedule.findFirst({
      where: { userId },
    });

    let result;
    if (existing) {
      result = await prisma.exportSchedule.update({
        where: { id: existing.id },
        data,
      });
    } else {
      result = await prisma.exportSchedule.create({
        data: {
          ...data,
          userId,
        },
      });
    }

    await cacheService.delete(CacheKeys.config.exportSchedule(userId));
    return result;
  }

  /**
   * Invalidate all config cache
   */
  public static async invalidateCache(): Promise<number> {
    return cacheService.deleteByPattern(CacheKeys.config.pattern());
  }
}
