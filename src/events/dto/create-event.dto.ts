export class CreateEventDto {
    readonly title: string;
    readonly description?: string;
    readonly date: Date;
    readonly location: string;
    readonly category: string;
    readonly price: number;
    readonly totalTickets: number;
    readonly availableTickets?: number;
}