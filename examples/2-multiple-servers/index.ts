import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import {
  NestFastifyApplication,
  FastifyAdapter,
} from "@nestjs/platform-fastify";

import FirstAppModule from "./first.module";
import SecondAppModule from "./second.module";

async function bootstrap() {
  const firstApp = await NestFactory.create<NestFastifyApplication>(
    FirstAppModule,
    new FastifyAdapter(),
  );
  const secondApp = await NestFactory.create<NestFastifyApplication>(
    SecondAppModule,
    new FastifyAdapter(),
  );

  await firstApp.listen(3001);
  await secondApp.listen(3002);
}

bootstrap();
