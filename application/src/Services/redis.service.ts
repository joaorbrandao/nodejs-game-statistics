import { Injectable, Scope } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis;
  }

  connetion(): Redis {
    return this.redis;
  }

  setTopStatistics(data) {
    this.redis.set('topStatistics', JSON.stringify(data));
  }

  getTopStatistics() {
    return this.redis.get("topStatistics").then(function(result) {
      return result;
    });
  }

  setGroupedByFirstLetterStatistics(data) {
    this.redis.set('groupedByFirstLetterStatistics', JSON.stringify(data));
  }

  getGroupedByFirstLetterStatistics() {
    return this.redis.get("groupedByFirstLetterStatistics").then(function(result) {
      return result;
    });
  }
}
