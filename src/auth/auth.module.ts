import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Importa il modulo per gestire le connessioni a MongoDB tramite Mongoose
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    // UsersModule per accedere ai servizi degli utenti
    UsersModule,

    // PassportModule per gestire l'autenticazione
    PassportModule,

    // ConfigModule per gestire le variabili di configurazione (se si utilizza .env per le variabili d'ambiente)
    ConfigModule.forRoot(),

    // JwtModule per gestire i JSON Web Tokens
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fd9h!oe90pPP8',
      signOptions: { expiresIn: '3y' }, // Scadenza del token a 3 anni
    }),
  ],
  providers: [
    AuthService, 
    JwtStrategy,  // La strategia per la validazione del JWT
  ],
  controllers: [AuthController], 
  exports: [AuthService],  // Esporto AuthService per permetterne l'uso in altri moduli
})
export class AuthModule {}
