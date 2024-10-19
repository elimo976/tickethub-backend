import { Test, TestingModule } from '@nestjs/testing';
import { TicketmasterService } from './ticketmaster.service';

describe('TicketmasterService', () => {
  let service: TicketmasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketmasterService],
    }).compile();

    service = module.get<TicketmasterService>(TicketmasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
