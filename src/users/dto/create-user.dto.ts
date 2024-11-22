import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from 'src/users/user.schema';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  role?: UserRole; // Questo campo è opzionale
}
