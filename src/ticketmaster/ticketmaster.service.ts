import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';  // Importa firstValueFrom

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

    async getEvents(countryCode: string, page: number): Promise<any> {
        try {
            const response = await firstValueFrom(this.httpService.get(this.API_URL, {
                params: {
                    apikey: this.API_KEY,
                    countryCode,
                    page,
                    size: 10,
                },
            }));
    
            // Controllo per verificare se i dati contengono eventi
            if (!response.data || !response.data._embedded || !response.data._embedded.events) {
                console.warn(`Nessun evento trovato per il paese: ${countryCode}`);
                return []; // Restituisci un array vuoto se non ci sono eventi
            }
    
            return response.data._embedded.events; // Restituisce solo gli eventi
        } catch (error) {
            // Gestione degli errori
            if (error.response) {
                console.error('Errore nella risposta dell\'API:', error.response.data);
                throw new HttpException(`Errore Ticketmaster: ${error.response.data?.message || 'Errore sconosciuto'}`, HttpStatus.BAD_REQUEST);
            } else {
                console.error('Errore di rete o di configurazione:', error.message);
                throw new HttpException('Impossibile recuperare eventi da Ticketmaster:', HttpStatus.BAD_REQUEST);
            }
        }
    }
    
}
