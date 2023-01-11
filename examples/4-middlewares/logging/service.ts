import { Injectable } from "@nestjs/common";

@Injectable()
export class LoggingService {
  writeLog(...args: any[]) {
    // replace with more sophisticated solution :)
    console.log(...args);
  }
}
