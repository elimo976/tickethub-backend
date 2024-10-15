import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/tickethubdb'),
    EventsModule,
    UsersModule,
    TicketsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
