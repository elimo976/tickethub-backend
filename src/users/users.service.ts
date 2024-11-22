import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model, Types } from 'mongoose';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userModel.find().select('-password').exec();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        'Errore durante il recupero degli utenti',
      );
    }
  }

  async getOneUser(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).select('-password').exec();
      if (!user) {
        throw new NotFoundException(
          `L\'utente con id ${id} non è stato trovato`,
        );
      }
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        // L'ID fornito non è valido
        throw new NotFoundException(
          `L\'utente con id ${id} non è stato trovato`,
        );
      }
      throw new InternalServerErrorException(
        "Errore durante il recupero dell'utente",
      );
    }
  }
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException(`L'ID ${userId} non è valido`);
    }

    try {
      const user = await this.userModel
        .findByIdAndUpdate(
          userId,
          { $set: updateProfileDto },
          { new: true, runValidators: true },
        )
        .select('-password')
        .exec();

      if (!user) {
        throw new NotFoundException(
          `L'utente con id ${userId} non è stato trovato`,
        );
      }

      return user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        "Errore durante l'aggiornamento del profilo dell'utente",
      );
    }
  }

  // Metodo per eliminare un account
  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0; // Ritorna true se l'account è stato trovato ed eliminato
  }
}
