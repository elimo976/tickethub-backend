import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TicketmasterModule } from './ticketmaster/ticketmaster.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AvatarsController } from './avatars/avatars.controller';
import { AvatarsModule } from './avatars/avatars.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/tickethubdb'),
    ConfigModule.forRoot({
      isGlobal: true,
    }), // Caricamento delle varibili degli environments
    EventsModule,
    UsersModule,
    TicketsModule,
    HttpModule,
    TicketmasterModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AvatarsModule,
  ],
  controllers: [AppController, AvatarsController],
  providers: [AppService],
})
export class AppModule {}
