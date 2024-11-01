import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
   constructor(@InjectModel(User.name) private userModel: Model<User>) {}

   async getAllUsers(): Promise<User[]> {
    try {
        return await this.userModel.find().exec();
    } catch (error) {
        throw new InternalServerErrorException('Errore durante il recupero degli utenti');
    }
   }

   async getOneUser(id: string): Promise<User> {
    try {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
      throw new NotFoundException(`L\'utente con id ${id} non è stato trovato`);
    }
    return user;
    } catch (error) {
        if (error.name === 'CastError') {
            // L'ID fornito non è valido
            throw new NotFoundException(`L\'utente con id ${id} non è stato trovato`)
        }
        throw new InternalServerErrorException('Errore durante il recupero dell\'utente');
    }
    
    
  }
}
