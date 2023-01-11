import { Module } from "@nestjs/common";
import { LoggingMiddleware } from "./middleware";

import { LoggingService } from "./service";

@Module({
  providers: [
    LoggingService,
    // register middleware class as provider
    LoggingMiddleware,
  ],
})
export default class LoggingModule {}
