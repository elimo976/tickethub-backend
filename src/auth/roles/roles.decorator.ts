import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/user.schema';

export const Roles = (role: UserRole) => SetMetadata('role', role); // Il decoratore Roles è una funzione che permette di specificare quale ruolo è richiesto per accedere a una determinata rotta del controller
