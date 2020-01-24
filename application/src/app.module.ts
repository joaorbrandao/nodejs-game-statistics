import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Models/user.entity';
import { Game } from './Models/game.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './Tasks/tasks.module';
import { RedisService } from './Services/redis.service';
import { StatisticsService } from './Services/statistics.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_games_stats',
      entities: [User, Game],
      synchronize: true,
    }),
    HttpModule,
    ScheduleModule.forRoot(), TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService, StatisticsService],
})
export class AppModule {}
