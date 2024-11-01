import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from 'src/users/user.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService) {}

    async register(createUserDto: CreateUserDto): Promise<{ message: string}> {
        const { firstName, lastName, email, password, role } = createUserDto;

        // Controllo se l'email è già in uso
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('Email già in uso');
        }

        // Crittografa la password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea un nuovo utente
        const newUser = new this.userModel({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: createUserDto.role ? UserRole.ADMIN : undefined, // `undefined` usa il valore di default del modello 
            isApproved: role === UserRole.ADMIN ? false : true // Richiede approvazione per gli admin
        });

        // Salva l'utente nel database
        try {
            await newUser.save();
            if (role === UserRole.ADMIN) {
                return { message: 'Registrazione completata. L\'account admin è in attesa di approvazione.' };
            } else {
                return { message: 'Registrazione avvenuta con successo.' };
            }
        } catch (error) {
            console.error("Errore durante la creazione dell'utente:", error);
            throw new Error("Errore durante la registrazione dell'utente");
        }
    }

    async login(email: string, password: string): Promise<{ accessToken: string }> {
        try {
            const user = await this.userModel.findOne({ email: email });

            if (!user) {
                throw new UnauthorizedException('Email non trovata');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Password non valida');
            }

            // Genera un token JWT per l'accesso
            const accessToken = await this.jwtService.sign({ userId: user._id, role: user.role });
            return { accessToken };
        } catch (error) {
            throw new UnauthorizedException('Errore durante il login: ' + error.message);
        }
    }

    async approveUser(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('Utente non trovato');
        }
        user.isApproved = true;
        return user.save();
    }
}
