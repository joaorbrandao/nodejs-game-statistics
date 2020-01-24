import { Injectable } from '@nestjs/common';
import { Game } from 'src/Models/game.entity';
import { RedisService } from './redis.service';

@Injectable()
export class StatisticsService {

  constructor(private readonly redisService: RedisService) {}

  updateTopStatistics(gamesList: Game[]) {
    // Top Statistics
    let topStatistics = {
        top5: [],
        top10: [],
        top100: []
    };
    // Sort Numerically Descending.
    gamesList.sort((a, b) => {return b.popularity - a.popularity});

    // Arrange output.
    for(let i = 0; i < 100; i++) {
        if (i >= 10) {
            topStatistics.top100.push(gamesList[i]);
        } else if(i >= 5) {
            topStatistics.top10.push(gamesList[i]);
            topStatistics.top100.push(gamesList[i]);
        } else {
            topStatistics.top5.push(gamesList[i]);
            topStatistics.top10.push(gamesList[i]);
            topStatistics.top100.push(gamesList[i]);
        }
    }
    
    this.redisService.setTopStatistics(topStatistics);
  }

  updateGroupedByFirstLetterStatistics(gamesList: Game[]) {
    // Sort Alphabetically by Game Name.
    gamesList.sort((a, b) => {
        let aFirstLetter = a.name.charAt(0);
        let bFirstLetter = b.name.charAt(0);

        if (aFirstLetter < bFirstLetter) {
            return -1;
        }

        if (aFirstLetter > bFirstLetter) {
            return 1;
        }

        return 0;
    });

    const gamesListLength = gamesList.length;

    let result = {};

    for(let i = 0; i < gamesListLength; i++) {
        let game = gamesList[i];
        let firstLetter = game.name.charAt(0);

        if (this.isNotLetter(firstLetter)) {
            continue;
        }

        if (result[firstLetter] === undefined) {
            result[firstLetter] = {
                totalPopularity: 0,
                totalGames: 0,
                games: []
            };
        } else {
            result[firstLetter]['totalPopularity'] += game.popularity;
            result[firstLetter]['games'].push({
                id: game.gameId,
                name: game.name,
                popularity: game.popularity
            });
            result[firstLetter]['totalGames'] = result[firstLetter]['games'].length;
        }
    }
    
    this.redisService.setGroupedByFirstLetterStatistics(result);
  }

  getTops() {
    return this.redisService.getTopStatistics();
  }

  getGroupedByFirstLetter() {
    return this.redisService.getGroupedByFirstLetterStatistics();
  }

  private isNotLetter(sample: string): boolean {
    if ((sample >= 'A' && sample <= 'Z') || (sample >= 'a' && sample <= 'z')) {
        return false;
    }
    return true;
  }
}
