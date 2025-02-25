export interface JwtPayload {
  sub: string; // L'ID univoco dell'utente
  username: string; // Il nome utente (o email) dell'utente
  role?: string;
}
