import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, EventDocument } from './event.schema';

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

    // Crea nuovo evento
    async create(createEventDto: CreateEventDto): Promise<Event> {
        const createdEvent = new this.eventModel(createEventDto);
        return createdEvent.save();
    }

    // Trova tutti gli eventi
    async findAll(): Promise<Event[]> {
        return this.eventModel.find().exec();
    }

    // Trova evento per ID
    async findOne(id: string): Promise<Event> {
        return this.eventModel.findById(id).exec();
    }

    // Aggiorna evento per ID
    async update(id: string, updateEventDto: CreateEventDto): Promise<Event> {
        return this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true}).exec();
    }

    // Elimina evento per ID
    async remove(id: string): Promise<any> {
        return this.eventModel.findByIdAndDelete(id).exec();
    }
}
