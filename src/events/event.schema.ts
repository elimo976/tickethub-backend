import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type EventDocument = Event & Document;

@Schema({ timestamps: true}) // Aggiunge automaticamente i campi 'cratedAt'
export class Event {
    @Prop({ required: true})
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true})
    date: Date;

    @Prop({ required: true})
    location: string;

    @Prop({ required: true})
    category: string;

    @Prop({ required: true})
    price: number;

    @Prop({ required: true})
    totalTickets: number;
    
    @Prop({ default: 0})
    availableTickets: number;// Array di IDs degli attendees

    @Prop({ required: true })
    imageUrl: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);