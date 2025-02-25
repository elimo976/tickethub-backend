import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from 'src/users/user.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // @InjectModel di Mongoose, fornisce direttamente accesso alla collezione User attraverso userModel
    private jwtService: JwtService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token?: string; message: string }> {
    const { firstName, lastName, email, password, role } = createUserDto;

    // Controllo se l'email è già in uso
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email già in uso');
    }

    // Crittografa la password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea il nuovo utente
    const newUser = new this.userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.USER,
      isApproved: role === UserRole.ADMIN ? false : true, // Richiede approvazione per gli admin
    });

    try {
      // Salva l'utente nel database
      const savedUser = await newUser.save();

      if (role === UserRole.ADMIN) {
        return {
          message:
            "Registrazione completata. L'account admin è in attesa di approvazione.",
        };
      } else {
        // Genera il payload per il token JWT
        const payload = { email: savedUser.email, userId: savedUser._id };

        // Genera e restituisce il token JWT per l'utente registrato
        const accessToken = this.jwtService.sign(payload);
        return {
          access_token: accessToken,
          message: 'Registrazione avvenuta con successo.',
        };
      }
    } catch (error) {
      console.error("Errore durante la creazione dell'utente:", error);
      throw new Error("Errore durante la registrazione dell'utente");
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    try {
      const user = await this.userModel
        .findOne({ email: email })
        .select('+password'); // per validare la password devo volontariamente includerla

      if (!user) {
        throw new UnauthorizedException('Email non trovata');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Password non valida');
      }

      // Genera un token JWT per l'accesso, includendo firstName e lastName
      const accessToken = await this.jwtService.sign({
        userId: user._id,
        role: user.role,
        firstName: user.firstName, // Aggiungi il firstName nel token
        lastName: user.lastName, // Aggiungi il lastName nel token
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException(
        'Errore durante il login: ' + error.message,
      );
    }
  }

  async approveAdmin(
    adminId: string,
    approverId: string,
  ): Promise<{ message: string; firstName: string; lastName: string }> {
    // Trova chi sta cercando di approvare
    const approver = await this.userModel.findById(approverId);
    if (!approver) {
      throw new NotFoundException('Amministratore non trovato');
    }
    if (approver.role !== UserRole.ADMIN || !approver.isApproved) {
      throw new UnauthorizedException(
        'Solo un admin approvato può approvare altri admin',
      );
    }

    // Trova l'admin da approvare
    const adminToApprove = await this.userModel.findById(adminId);
    if (!adminToApprove) {
      throw new NotFoundException('Utente non trovato');
    }
    if (adminToApprove.role !== UserRole.ADMIN) {
      throw new ConflictException(
        "Puoi approvare solo utenti con ruolo 'admin'",
      );
    }
    if (adminToApprove.isApproved) {
      return {
        message: 'Questo admin è già stato approvato',
        firstName: adminToApprove.firstName,
        lastName: adminToApprove.lastName,
      };
    }

    // Approva l'admin
    adminToApprove.isApproved = true;
    await adminToApprove.save();

    return {
      message: `L'admin ${adminToApprove.firstName} ${adminToApprove.lastName} è stato approvato con successo.`,
      firstName: adminToApprove.firstName,
      lastName: adminToApprove.lastName,
    };
  }
}
