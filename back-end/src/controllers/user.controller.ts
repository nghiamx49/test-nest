import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from 'src/dtos/users/user.dto';
import { UserService } from 'src/services/user.services';
import { Response } from 'express';
import { LocalAuthenticateGuard } from 'src/middlewares/authorize.middleware';


@Controller(`api/v1/authenticate`)
export class UserController {
  constructor(private readonly service: UserService) {}

  @UseGuards(LocalAuthenticateGuard)
  @Post('login')
  async login(
    @Request() request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    return await this.service.login(request, response);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    return await this.service.register(registerDto, response);
  }
}