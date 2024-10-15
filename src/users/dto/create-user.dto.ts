export class CreateUserDto {
    username: string;
    password: string;
    email: string;
    isAdmin?: boolean; // true se admin, false o undefined se utente normale
}