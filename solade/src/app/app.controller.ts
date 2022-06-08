import { Controller, Get } from "@nestjs/common";

@Controller('/')
export class AppController {
  constructor() {}

  @Get('health')
  async health(): Promise<null> {
    return null;
  }
}
