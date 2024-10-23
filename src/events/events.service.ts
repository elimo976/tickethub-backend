import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, EventDocument } from './event.schema';

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

    // Crea nuovo evento
    async create(createEventDto: CreateEventDto): Promise<Event> {
        try {
            const createdEvent = new this.eventModel(createEventDto);
            return await createdEvent.save();
        } catch (error) {
            console.error('Errore nella creazione dell\'evento:', error);
    
            if (error.name === 'ValidationError') {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'La convalida non è riuscita per i dati dell\'evento forniti',
                }, HttpStatus.BAD_REQUEST);
            }
    
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Impossibile creare l\'evento a causa di un errore interno al server',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async searchEvents(keyword: string): Promise<Event[]> {
        this.logger.log(`Searching events with keyword: ${keyword}`);
    
        // Verifica se la keyword è valida
        if (!keyword || typeof keyword !== 'string') {
            this.logger.warn(`Invalid keyword provided: ${keyword}`);
            throw new HttpException('Keyword non valida', HttpStatus.BAD_REQUEST);
        }
    
        try {
            this.logger.log('Starting database query...');
    
            const events = await this.eventModel.find({
                $or: [
                    { title: { $regex: keyword, $options: 'i' } },
                    { 'venues.name': { $regex: keyword, $options: 'i' } }, // Cercare per nome del luogo
                    { 'venues.city.name': { $regex: keyword, $options: 'i' } },
                    { category: { $regex: keyword, $options: 'i' } }
                ]
            }).exec();
    
            this.logger.log(`Database query completed. Found ${events.length} events for keyword: ${keyword}`);
    
            // Se non ci sono eventi trovati
            if (events.length === 0) {
                this.logger.warn(`No events found for keyword: ${keyword}`);
            }
    
            return events;
    
        } catch (error) {
            this.logger.error('Error occurred during the database query', error.stack);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Impossibile cercare eventi a causa di un errore interno del server',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

    // Trova tutti gli eventi
    async findAll(): Promise<Event[]> {
        try {
            return await this.eventModel.find().exec();
        } catch (error) {
            console.error('Errore nella ricerca degli eventi:', error);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Impossibile recuperare gli eventi a causa di un errore interno del server',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Trova evento per ID
    async findOne(id: string): Promise<Event> {
        try {
            const event = await this.eventModel.findById(id).exec();
            if (!event) {
                throw new HttpException('Evento non trovato', HttpStatus.NOT_FOUND);
            }
            return event;
        } catch (error) {
            console.error('Errore durante la ricerca dell\'evento:', error);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Impossibile recuperare l\'evento a causa di un errore interno del server',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Aggiorna evento per ID
    async update(id: string, updateEventDto: CreateEventDto): Promise<Event> {
        try {
            const updatedEvent = await this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true }).exec();
            if (!updatedEvent) {
                throw new HttpException('Evento non trovato', HttpStatus.NOT_FOUND);
            }
            return updatedEvent;
        } catch (error) {
            console.error('Errore durante l \'aggiornamento dell\'evento:', error);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Impossibile aggiornare l\'evento a causa di un errore interno al server',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Elimina evento per ID
    async remove(id: string): Promise<any> {
        try {
            const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();
            if (!deletedEvent) {
                throw new HttpException('Evento non trovato', HttpStatus.NOT_FOUND);
            }
            return { message: 'Evento eliminato con successo!' };
        } catch (error) {
            console.error('Errore durante l\'eliminazione dell\'evento:', error);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Impossibile eliminare l\'evento a causa di un errore interno del server',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}