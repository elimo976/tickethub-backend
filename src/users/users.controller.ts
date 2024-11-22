import { Controller, Get, Param, Patch, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // Endpoint per ottenere tutti gli utenti
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  // Endpoint per ottenere un utente in base al suo ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.getOneUser(id);
  }

  // Endpoint per aggiornare il profilo di un utente
  @Patch('profile/:id')
  async updateProfile(
    @Param('id') userId: string, // Identificativo dell'utente da aggiornare
    @Body() updateProfileDto: UpdateProfileDto, // DTO per i dati di aggiornamento
  ): Promise<User> {
    console.log(`Controller - PATCH /users/profile/${userId}`);
    console.log('DTO ricevuto:', updateProfileDto); // Logga il payload ricevuto
    return this.userService.updateProfile(userId, updateProfileDto);
  }

  // Endpoint per eliminare un account
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const result = await this.userService.deleteUser(id);
    if (!result) {
      throw new Error('Account non trovato');
    }
    return { message: 'Account eliminato con successo' };
  }
}
