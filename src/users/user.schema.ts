import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Schema({ timestamps: true }) // Gestisce createdAt e updatedAt automaticamente
export class User {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string; // Nel db non possono esistere 2 utenti con la stessa email

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Prop({ default: false})
    isApproved: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
