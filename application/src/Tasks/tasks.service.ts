import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { getManager, EntityManager } from "typeorm";
import { Game } from 'src/Models/game.entity';
import { User } from 'src/Models/user.entity';
import * as tasksConfig from '../Config/tasks.config';
import axios from 'axios';
import LazyClientWebSocketObserver from '../Notifications/WebSockets/LazyClientWebSocketObserver';
import LazyClientNotifierSubject from '../Notifications/LazyClientNotifierSubject';
import appConfig from 'src/Config/app.config';
import LazyClientRedisObserver from 'src/Notifications/Redis/LazyClientRedisOberver';
import { AppService } from 'src/app.service';
import { StatisticsService } from 'src/Services/statistics.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  entityManager: EntityManager;
  updateStatisticsFrequency: number;

  constructor(private readonly appService: AppService, private readonly statisticsService: StatisticsService){
    this.entityManager = getManager();
    this.updateStatisticsFrequency = tasksConfig.default.updateStatisticsEvery * 1000;
  }

// The idea was to load from Config/tasks.config.ts the amount for the interval.
// But I didn't manage to make it working.
//   @Interval(this.updateStatisticsFrequency)
@Interval(5000)
  async handleInterval() {
    // 1. Request games list from external source
    axios.get('http://localhost:8080/api/v1/games')
      .then(async (response) => {
        this.logger.log('Request http://localhost:8080/api/v1/games was a success!');

        let gamesList: Game[] = response.data;

        // Update Statistics
        this.statisticsService.updateTopStatistics(gamesList);
        this.statisticsService.updateGroupedByFirstLetterStatistics(gamesList);
        
        // 2. After statistics have been updated, notify the Lazy Clients
        // The Observer Pattern would fit here.
        // We could notify() all the Users that are LazyClients.

        //  2.1. This is all be doing here because it is the first time I'm using
        // Typescript and NestJS and my knowledge about these is limited.
        // But in a real application this could be done:
        // - Attach a new observer everytime a record is marked as isLazy at user table.
        // - Resolve from the application's service container  the LazyClientNotifierSubject already with all the attached users.
        // - And now the only thing we should do in here is call the notify() method to tell them that they can now request data!
        const usersList = await this.entityManager.createQueryBuilder(User, "user")
          .where("user.validUntil >= :now", { now: new Date() })
          .andWhere("user.isLazy = :isLazy", { isLazy: true })
          .getMany();

        if (usersList) {
          let lazyClientNotifierSubject = new LazyClientNotifierSubject();

          // Attach all the LazyClients
            usersList.forEach(user => {
                if (appConfig.notifications.driver === 'websockets') {
                    lazyClientNotifierSubject.attach(new LazyClientWebSocketObserver(user));
                } else if (appConfig.notifications.driver === 'redis') {
                    lazyClientNotifierSubject.attach(new LazyClientRedisObserver(user));
                }
            });
          
          lazyClientNotifierSubject.notify();
        }
      })
      .catch(function (error) {
        // As the request failed and we need to repeat the request
        // we could put this Axios request inside a function and use recursivity
        // to try a second time. For safety, pass a boolean flag to indicate that
        // this cannot be done if it fails again!
        console.error('Request http://localhost:8080/api/v1/games failed!');
      });
  }
}