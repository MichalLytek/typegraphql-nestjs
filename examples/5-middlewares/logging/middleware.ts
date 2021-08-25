import { Injectable } from "@nestjs/common";
import { MiddlewareInterface, NextFn, ResolverData } from "type-graphql";
import { LoggingService } from "./service";

@Injectable()
export class LoggingMiddleware implements MiddlewareInterface {
  constructor(private readonly loggingService: LoggingService) {}

  async use({ info }: ResolverData, next: NextFn) {
    this.loggingService.writeLog(
      `${info.parentType.name}.${info.fieldName} resolver executed`,
    );
    return next();
  }
}
