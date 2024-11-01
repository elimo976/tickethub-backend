import { BadRequestException, Body, Controller, InternalServerErrorException, Param, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/users/user.schema';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() body: CreateUserDto) {
        // Crea una copia del body senza il campo password
        const { password, ...bodyWithoutPassword } = body;
        console.log('Body della richiesta:', bodyWithoutPassword); // Log per debug
        try {
            const response = await this.authService.register(body);
            return response;  // Restituisce direttamente l'oggetto { message: string }
        } catch (error) {
            console.error('Errore durante la registrazione:', error);
            throw new BadRequestException('Errore durante la registrazione: ' + error.message);
        }
    }    
    
@Post('login')
async login(@Body() body: { email: string; password: string }) {
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

@Patch('approve/:userId')
@UseGuards(AuthGuard('jwt'), RolesGuard) // AuthGuard verifica il token JWT e RolesGuard controlla se l’utente ha il ruolo admin.
@Roles(UserRole.ADMIN) // Restringe l'accesso ai soli admin approvati
async approveUser(@Param('userId') userId: string) {
    const user = await this.authService.approveUser(userId);
    return { message: `Utente ${user.firstName} ${user.lastName} approvato con successo`};
}
}
