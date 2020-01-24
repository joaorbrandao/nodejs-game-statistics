import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { getManager, EntityManager } from "typeorm";
import { User } from './Models/user.entity';
import { StatisticsService } from './Services/statistics.service';

@Controller()
export class AppController {
    entityManager: EntityManager;

  constructor(private readonly appService: AppService, private readonly statisticsService: StatisticsService) {
      this.entityManager = getManager();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('topstatistics')
  async topStatistics(@Req() request: Request) {
    // 1. Validate Client ID
    let clientId: string = request.body.clientId;
    
    const user = await this.entityManager.createQueryBuilder(User, "user")
        .where("user.clientId = :clientId", { clientId: clientId })
        .andWhere("user.validUntil >= :now", { now: new Date() })
        .getOne();

        console.log(user);

    if (!user) {
        return JSON.stringify({
            status: 401,
            message: 'Unauthorized.'
        });
    }

    // 2. Read statistics
    return this.statisticsService.getTops();
  }

  @Post('popularityalphabetsorted')
  async popularityAlphabetSorted(@Req() request: Request) {
    // 1. Validate Client ID
    let clientId: string = request.body.clientId;
    
    const user = await this.entityManager.createQueryBuilder(User, "user")
        .where("user.clientId = :clientId", { clientId: clientId })
        .andWhere("user.validUntil >= :now", { now: new Date() })
        .getOne();

    if (!user) {
        return JSON.stringify({
            status: 401,
            message: 'Unauthorized.'
        });
    }

    // 2. Read statistics
    return this.statisticsService.getGroupedByFirstLetter();
  }
}
