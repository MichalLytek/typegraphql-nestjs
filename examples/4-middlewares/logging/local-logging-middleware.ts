import { Injectable } from "@nestjs/common";
import { MiddlewareInterface, NextFn, ResolverData } from "type-graphql";
import { LoggingService } from "./service";
import { AppContext } from "../context";

@Injectable()
export class LocalLoggingMiddleware implements MiddlewareInterface<AppContext> {
  constructor(private readonly loggingService: LoggingService) {}

  async use({ context, info }: ResolverData<AppContext>, next: NextFn) {
    this.loggingService.writeLog(
      `${context.user ?? "Somebody"} has accessed ${info.parentType.name}.${info.fieldName}`,
    );
    return next();
  }
}
