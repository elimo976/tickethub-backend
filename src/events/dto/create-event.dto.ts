import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly description?: string;

    @IsDate()
    @Type(() => Date) // Questo trasforma l'input in un oggetto Date
    readonly date: Date;

    @IsString()
    readonly location: string;

    @IsString()
    readonly category: string;

    @IsNumber()
    readonly price: number;

    @IsNumber()
    readonly totalTickets: number;

    @IsOptional()
    @IsNumber()
    readonly availableTickets?: number;

    @IsString()
    readonly imageUrl: string;
}