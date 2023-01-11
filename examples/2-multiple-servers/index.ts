import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import {
  NestExpressApplication,
  ExpressAdapter,
} from "@nestjs/platform-express";

import FirstAppModule from "./first.module";
import SecondAppModule from "./second.module";

async function bootstrap() {
  const firstApp = await NestFactory.create<NestExpressApplication>(
    FirstAppModule,
    new ExpressAdapter(),
  );
  const secondApp = await NestFactory.create<NestExpressApplication>(
    SecondAppModule,
    new ExpressAdapter(),
  );

  await firstApp.listen(3001);
  await secondApp.listen(3002);
}

bootstrap();
