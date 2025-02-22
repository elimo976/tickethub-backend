import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { TicketmasterService } from 'src/ticketmaster/ticketmaster.service';

@Controller('events')
export class EventsController {
    private readonly logger = new Logger(EventsController.name);

    constructor(
        private readonly eventsService: EventsService,
        private readonly ticketmasterService: TicketmasterService
    ) {}

    // Crea un nuovo evento
    @Post()
    @HttpCode(HttpStatus.CREATED)  // Restituisce il codice 201 per la creazione
    async create(@Body() createEventDto: CreateEventDto) {
        try {
            const event = await this.eventsService.create(createEventDto);
            return { message: 'Evento creato con successo!', event };
        } catch (error) {
            console.error('Errore durante la creazione dell\'evento: ', error);
            throw new HttpException('Errore nella creazione dell\'evento', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Popola il database con eventi provenienti da Ticketmaster
    @Post('populate-europe')
    async populateEuropeDatabase(@Body() body: { countryCodes: string[] }) {
        const { countryCodes } = body; // Estrai i codici paese dal body

        try {
            for (const countryCode of countryCodes) {
                console.log(`Popolando eventi per il paese: ${countryCode}`);
                let page = 0;
                let hasMoreEvents = true;

                while (hasMoreEvents) {
                    const events = await this.ticketmasterService.getEvents(countryCode, page);
                    
                    const eventPromises = events.map(async event => {
                        try {
                            const eventData: CreateEventDto = {
                                title: event.name || 'N/A',
                                description: event.info?.summary || 'Nessuna descrizione disponibile',
                                date: new Date(event.dates?.start?.localDate || Date.now()),
                                venues: event._embedded?.venues.map(venue => ({
                                    name: venue.name || 'Location sconosciuta',
                                    city: { name: venue.city?.name || 'Città sconosciuta' }
                                })) || [],
                                category: event.classifications?.[0]?.segment?.name || 'Categoria sconosciuta',
                                price: event.priceRanges?.map(priceRange => ({
                                    type: priceRange.type || 'Standard',
                                    currency: priceRange.currency || 'EUR',
                                    min: priceRange.min || 0,
                                    max: priceRange.max || 0
                                })) || [],
                                totalTickets: event.seatmap?.staticUrl ? 1000 : 0,
                                availableTickets: event.seatmap?.staticUrl ? 1000 : 0,
                                imageUrl: event.images?.[0]?.url || 'URL immagine non disponibile',
                                countryCode,
                            };
                            return this.eventsService.create(eventData);
                        } catch (err) {
                            console.error('Errore nel singolo evento:', err, 'Dati evento:', event);
                        }
                    });                    

                    await Promise.all(eventPromises);

                    // Verifica se ci sono più pagine di eventi
                    hasMoreEvents = events._links?.next ? true : false;
                    page++;
                }
            }
            
            return { message: 'Database popolato con eventi europei con successo!' };
        } catch (error) {
            console.error('Errore durante il popolamento del database: ', error);
            throw new HttpException('Errore nel popolamento del database', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint per gestire le richieste di ricerca
    @Get('search')
    async search(@Query('keyword') keyword: string) {
        this.logger.log(`Received search request: ${keyword}`);
        if (!keyword) {
            this.logger.warn('Keyword is missing');
            return { status: 400, message: 'Keyword is required'};
        }
        try {
            const events = await this.eventsService.searchEvents(keyword);
            this.logger.log(`Found ${events.length} events for keyword: ${keyword}`);
            return events; // 200 OK
        } catch (error) {
            this.logger.error(`Error during event search: ${error.message}, error.stack`);
            throw error; // 400 KO
        }
    }

    // Recupera tutti gli eventi
    @Get()
    async findAll() {
        try {
            const events = await this.eventsService.findAll();
            if (!events || events.length === 0) {
                throw new HttpException('Nessun evento trovato', HttpStatus.NOT_FOUND);
            }
            return events;  // 200 OK
        } catch (error) {
            console.error('Errore durante il recupero degli eventi: ', error);
            throw new HttpException('Errore nel recupero degli eventi', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Recupera un singolo evento per ID
    @Get(':id')
    async findOne(@Param('id') id: string) {
        this.logger.log(`Richiesta evento ID: ${id}`);
        try {
            const event = await this.eventsService.findOne(id);
            if (!event) {
                throw new HttpException('Evento non trovato', HttpStatus.NOT_FOUND);  // 404 Not Found
            }
            return event;  // 200 OK
        } catch (error) {
            console.error('Errore durante il recupero dell\'evento: ', error);
            throw new HttpException('Errore nel recupero dell\'evento', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Aggiorna un evento esistente
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateEventDto: CreateEventDto) {
        try {
            const updatedEvent = await this.eventsService.update(id, updateEventDto);
            if (!updatedEvent) {
                throw new HttpException('Evento non trovato per l\'aggiornamento', HttpStatus.NOT_FOUND);
            }
            return { message: 'Evento aggiornato con successo!', updatedEvent };
        } catch (error) {
            console.error('Errore durante l\'aggiornamento dell\'evento: ', error);
            throw new HttpException('Errore nell\'aggiornamento dell\'evento', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Elimina un evento
    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            const deletedEvent = await this.eventsService.remove(id);
            if (!deletedEvent) {
                throw new HttpException('Evento non trovato per l\'eliminazione', HttpStatus.NOT_FOUND);
            }
            return { message: 'Evento eliminato con successo!' };
        } catch (error) {
            console.error('Errore durante l\'eliminazione dell\'evento: ', error);
            throw new HttpException('Errore nell\'eliminazione dell\'evento', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}