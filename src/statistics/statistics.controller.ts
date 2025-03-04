import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('city')
  async getUsersByCity(): Promise<any> {
    return await this.statisticsService.getUsersByCity();
  }
  @Get('age')
  async getUsersByAge(): Promise<any> {
    return await this.statisticsService.getUsersByAge();
  }
}
