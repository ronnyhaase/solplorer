import { Controller, HttpException, HttpStatus, Post, Query } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { SolanaCacheService } from '../solana/solana-cache.service';

@Controller('/admin')
export class AdminController {
  constructor(
    private configService: ConfigService,
    private solanaCacheService: SolanaCacheService
  ) {}

  @Post('/update-caches')
  async updateCaches(@Query('token') token) {
    if (token !== this.configService.get('ADMIN_TOKEN')) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }

    this.solanaCacheService.updateAll()
  }
}
