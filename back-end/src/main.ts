import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

async function startup() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.API_VERSION);
  app.enableCors({origin: "*"});
  app.use(morgan('dev'));
  app.use(helmet());

  await app.listen(3000);
}
startup(); 
