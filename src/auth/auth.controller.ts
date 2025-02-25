import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/users/user.schema';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    // Crea una copia del body senza il campo password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...bodyWithoutPassword } = body;
    console.log('Body della richiesta:', bodyWithoutPassword); // Log per debug
    try {
      const response = await this.authService.register(body);
      // Restituisce direttamente l'oggetto con accessToken, come nel login
      if (response.access_token) {
        return {
          statusCode: 201,
          message: response.message,
          accessToken: response.access_token,
        };
      } else {
        // Gestisce il caso in cui l'utente è un admin in attesa di approvazione
        return {
          statusCode: 201,
          message: response.message,
        };
      }
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      throw new BadRequestException(
        'Errore durante la registrazione: ' + error.message,
      );
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...bodyWithoutPassword } = body;
    console.log('Body della richiesta (senza password):', bodyWithoutPassword); // Log per debug
    try {
      // Chiama il servizio di login e restituisce il token
      const token = await this.authService.login(body.email, body.password);
      return {
        statusCode: 200,
        message: 'Login effettuato con successo',
        accessToken: token.accessToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw new InternalServerErrorException('Errore durante il login');
    }
  }

  @Patch('approve-admin/:adminId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async approveAdmin(@Param('adminId') adminId: string, @Request() req) {
    const approverId = req.user.userId; // Recupera l'ID di chi approva

    const { message, firstName, lastName } =
      await this.authService.approveAdmin(adminId, approverId);

    return { message, firstName, lastName };
  }
}
