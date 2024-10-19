import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "src/users/user.schema";

export type TicketDocument = Ticket & Document;

@Schema({ timestamps: true })
export class Ticket {
    @Prop({ required: true, type: Event })
    event: Event;

    @Prop({ required: true, type: User })
    user: User;

    @Prop({ required: true })
    purchaseDate: Date;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    imageUrl: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);