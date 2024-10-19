import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, EventDocument } from './event.schema';

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

    // Crea nuovo evento
    async create(createEventDto: CreateEventDto): Promise<Event> {
        try {
            const createdEvent = new this.eventModel(createEventDto);
            return await createdEvent.save();
        } catch (error) {
            // Log dell'errore per il debug
            console.error('Error creating event:', error);
    
            // Controlla se l'errore è un errore di validazione di Mongoose
            if (error.name === 'ValidationError') {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Validation failed for the provided event data',
                }, HttpStatus.BAD_REQUEST);
            }
    
            // Altri tipi di errori
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Could not create the event due to an internal server error',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
