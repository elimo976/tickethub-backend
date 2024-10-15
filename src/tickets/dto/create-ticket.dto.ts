export class CreateTicketDto {
    event: string; // ID dell'evento collegato
    price: number;
    quantity: number;
    purchaisedBy?: string; // ID dell'utente che ha acquistato il biglietto (opzionale se non ancora acquistato)
}