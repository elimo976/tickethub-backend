import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {} // questa guard usa la strategy jwt per assicurarsi che solo gli utenti autenticati possano accedere a determinate rotte