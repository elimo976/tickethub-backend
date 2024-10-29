export interface EventResponse {
    _links: {
        next?: { href: string }; // O altre proprietà se necessario
    };
    _embedded: {
        events: Event[]; // Supponendo che ci sia un array di eventi qui
    };
}

export interface Event {
    title: string;
    description: string;
    date: Date;
    venues: { name: string; city: { name: string } }[];
    countryCode: string;
    category: string;
    price: { type: string; currency: string; min: number; max: number }[];
    totalTickets: number;
    availableTickets: number;
    imageUrl: string;
}
