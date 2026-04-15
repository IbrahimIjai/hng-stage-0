import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ClassifyService } from './classify.service';

@Controller('api/classify')
export class ClassifyController {
  constructor(private readonly classifyService: ClassifyService) {}

  @Get()
  classify(@Query('name') name: string) {
    if (!name) {
      throw new BadRequestException('Missing or empty name parameter');
    }

    return this.classifyService.classifyName(name);
  }
}
