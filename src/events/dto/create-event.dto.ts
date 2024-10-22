import { Type } from "class-transformer";
import { IsArray, IsDate, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type as ClassType } from 'class-transformer';

class CityDto {
    @IsString()
    readonly name: string;
}

class VenueDto {
    @IsString()
    readonly name: string;  // Aggiunto il campo name

    @ValidateNested()
    @ClassType(() => CityDto)
    readonly city: CityDto;
}

class PriceRangeDto {
    @IsString()
    readonly type: string;

    @IsString()
    readonly currency: string;

    @IsNumber()
    readonly min: number;

    @IsNumber()
    readonly max: number;
}

export class CreateEventDto {
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly description?: string;

    @IsDate()
    @Type(() => Date) 
    readonly date: Date;

    @ValidateNested({ each: true })
    @ClassType(() => VenueDto)
    readonly venues: VenueDto[];

    @IsString()
    readonly category: string;

    @ValidateNested({ each: true })  // Aggiunto per validare un array di PriceRange
    @ClassType(() => PriceRangeDto)
    readonly price: PriceRangeDto[];  // Modificato per essere un array di oggetti PriceRange

    @IsNumber()
    readonly totalTickets: number;

    @IsOptional()
    @IsNumber()
    readonly availableTickets?: number;

    @IsString()
    readonly imageUrl: string;

    @IsArray()
    @IsString({ each: true})
    readonly countryCode: string;
}