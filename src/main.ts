import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000, () => {
    console.log('Tickethub backend started');
  });

  // Middleware globale di logging per tracciare le richieste
  app.use((req, res, next) => {
    console.log(
      `Global Middleware: Received ${req.method} request to ${req.url}`,
    );
    next();
  });
}
bootstrap();
