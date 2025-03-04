import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: [{ name: String, city: { name: String } }] })
  venues: { name: string; city: { name: string } }[];

  @Prop({ required: false })
  countryCode: string;

  @Prop({ required: true })
  category: string;

  @Prop({
    required: true,
    type: [
      {
        type: { type: String, required: true },
        currency: { type: String, required: true },
        min: { type: Number, required: true },
        max: { type: Number, required: true },
      },
    ],
  })
  price: { type: string; currency: string; min: number; max: number }[];

  @Prop({ required: true })
  totalTickets: number;

  @Prop({ default: 0 })
  availableTickets: number;

  @Prop({ required: true })
  imageUrl: string;
}

export type EventDocument = Event & Document;
export const EventSchema = SchemaFactory.createForClass(Event);
