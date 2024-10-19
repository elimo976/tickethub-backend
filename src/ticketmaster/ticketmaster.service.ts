import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TicketmasterService {
    private readonly API_URL: string;
    private readonly API_KEY: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.API_URL = this.configService.get<string>('TICKETMASTER_API_URL');
        this.API_KEY = this.configService.get<string>('TICKETMASTER_API_KEY');
    }

    async getEvents() {
        try {
            const url = `${this.API_URL}?apikey=${this.API_KEY}`;
            const response = await firstValueFrom(this.httpService.get(url));
            return response.data;
        } catch (error) {
            console.error('Error fetching events from Ticketmaster:', error);
    
            if (error.response) {
                // Se l'API Ticketmaster ha restituito una risposta d'errore
                throw new HttpException({
                    status: error.response.status,
                    message: error.response.data || 'Error fetching events',
                }, error.response.status);
            } else {
                // Se l'errore non è legato alla risposta dell'API
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Could not fetch events due to an internal server error',
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
