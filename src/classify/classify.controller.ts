import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassifyService } from './classify.service';

@Controller('api/classify')
export class ClassifyController {
  constructor(private readonly classifyService: ClassifyService) {}

  @Get()
  classify(@Param('name') name: string) {
    return this.classifyService.classifyName(name);
  }
}
