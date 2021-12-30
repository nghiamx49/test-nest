import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.schema';
import {
  RegisterDto,
  UserResponseDto,
} from 'src/dtos/users/user.dto';
import { Response } from 'express';
import { PasswordEncoder } from 'src/utils/crypto.util';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    private readonly passwordEncoder: PasswordEncoder,
    private jwtService: JwtService
  ) {}

  async login(request, response: Response) {
    console.log(process.env.SECRET_KEY);
    response.status(HttpStatus.OK).json({
      data: new UserResponseDto(request.user),
      isAuthenticated: true,
      token: this.jwtService.sign({ username: request?.user?.username }),
    });
  }

  async register(registerDto: RegisterDto, response: Response) {
    const { username } = registerDto;
    const findUser: User = await this.UserModel.findOne({ username });
    if (findUser) {
       response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Account already existed!',
      });
      return;
    } else {
      const newUser = new this.UserModel({
        ...registerDto,
        password: this.passwordEncoder.encodePassword(registerDto.password),
      });
      await newUser.save();
      const data = await new UserResponseDto(newUser);
       response.status(HttpStatus.CREATED).json({ data });
      return;
    }
  }
}
