import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ required: true, select: false }) // select: false esclude il campo password di
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop()
  dateOfBirth?: Date;

  @Prop({
    type: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  })
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };

  @Prop({
    type: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  })
  geoLocation?: {
    latitude?: number;
    longitude?: number;
  };

  @Prop({
    validate: {
      validator: (v: string) => /\+?[0-9]{7,15}/.test(v),
      message: (props) => `${props.value} non è un numero di telefono valido!`,
    },
  })
  phoneNumber?: string;

  @Prop([String])
  interests?: string[];

  @Prop()
  bio?: string;

  @Prop({
    default:
      'https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png',
  })
  avatarUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
