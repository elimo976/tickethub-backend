import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';

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
}
