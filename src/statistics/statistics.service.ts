import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';

@Injectable()
export class StatisticsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Aggregazione per numero di utenti per città
  async getUsersByCity(): Promise<any> {
    return await this.userModel.aggregate([
      { $group: { _id: '$address.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  }

  // Ottieni utenti in base all'età (calcolata dinamicamente)
  async getUsersByAge(): Promise<any> {
    return await this.userModel.aggregate([
      {
        $addFields: {
          age: {
            $subtract: [new Date(), '$dateOfBirth'],
          },
        },
      },
      {
        $project: {
          age: { $floor: { $divide: ['$age', 31557500000] } }, // Converti millisecondi in anni
        },
      },
      {
        $group: {
          _id: '$age',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Ordina per età crescente
    ]);
  }

  async getUsersByRole(): Promise<any> {
    return await this.userModel.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
  }
}
