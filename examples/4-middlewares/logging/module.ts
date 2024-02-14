import { Module } from "@nestjs/common";
import { GlobalLoggingMiddleware } from "./global-logging-middleware";

import { LoggingService } from "./service";
import { LocalLoggingMiddleware } from "./local-logging-middleware";

@Module({
  providers: [
    LoggingService,
    // register middleware class as provider
    GlobalLoggingMiddleware,
    LocalLoggingMiddleware,
  ],
})
export default class LoggingModule {}
