import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    email: string;

    @Prop({ type: String, enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);