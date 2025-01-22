import { Module } from '@nestjs/common';
import { AvatarsController } from './avatars.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule], // Importa il UsersModule, che contiene il UsersService
  controllers: [AvatarsController], // Il controller che gestisce le richieste per gli avatar
})
export class AvatarsModule {}
