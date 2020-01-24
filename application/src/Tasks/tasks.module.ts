import { Module, HttpModule } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AppService } from 'src/app.service';
import { RedisService } from 'src/Services/redis.service';
import { StatisticsService } from 'src/Services/statistics.service';

@Module({
  imports: [HttpModule],
  providers: [TasksService, AppService, RedisService, StatisticsService],
})
export class TasksModule {}