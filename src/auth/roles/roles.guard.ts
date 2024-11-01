import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from 'src/users/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // Reflector è una classe di NestJS che permette di leggere i metadati definiti sulle rotte, come il ruolo richiesto (impostato con @Roles).
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Ottiene il ruolo richiesto dai metadati della rotta
    const requiredRole = this.reflector.get<UserRole>('role', context.getHandler());
    if (!requiredRole) {
      return true; // Nessun ruolo richiesto per questa rotta
    }
    // Ottiene l'utente dal contesto della richiesta
    const { user } = context.switchToHttp().getRequest();
    return user?.role === requiredRole; // Verifica se l'utente ha il ruolo richiesto
  }
}
