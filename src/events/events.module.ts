import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './event.schema';
import { TicketmasterModule } from 'src/ticketmaster/ticketmaster.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema}]),
    TicketmasterModule
  ],
  providers: [EventsService],
  controllers: [EventsController]
})
export class EventsModule {}
