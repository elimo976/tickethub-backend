import { Module } from '@nestjs/common';
import { TicketmasterService } from './ticketmaster.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[HttpModule, ConfigModule],
  providers: [TicketmasterService],
  exports: [TicketmasterService]  // Per permettere l'uso di TicketmasterService in altri moduli
})
export class TicketmasterModule {}
