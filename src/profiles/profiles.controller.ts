import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnprocessableEntityException,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ProfilesService } from './profiles.service';

@Controller('api/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async create(@Body() body: { name: string }, @Res({ passthrough: true }) response: Response) {
    if (!body || !body.hasOwnProperty('name')) {
      throw new BadRequestException('Missing or empty name');
    }

    const { name } = body;

    if (name === null || name === undefined || name === '') {
      throw new BadRequestException('Missing or empty name');
    }

    if (typeof name !== 'string') {
      throw new UnprocessableEntityException('Invalid type');
    }

    if (name.trim() === '') {
      throw new BadRequestException('Missing or empty name');
    }

    const result = await this.profilesService.createProfile(name);

    if (result.isExisting) {
      response.status(HttpStatus.OK);
      return {
        status: 'success',
        message: 'Profile already exists',
        data: result.profile,
      };
    }

    response.status(HttpStatus.CREATED);
    return {
      status: 'success',
      data: result.profile,
    };
  }

  @Get()
  async findAll(
    @Query('gender') gender?: string,
    @Query('country_id') country_id?: string,
    @Query('age_group') age_group?: string,
  ) {
    const profiles = await this.profilesService.findAll({
      gender,
      country_id,
      age_group,
    });
    return {
      status: 'success',
      count: profiles.length,
      data: profiles,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const profile = await this.profilesService.findOne(id);
    return {
      status: 'success',
      data: profile,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.profilesService.remove(id);
  }
}
