import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordEncoder } from 'src/utils/crypto.util';
import { Model } from 'mongoose';
import { UserDocument, User } from 'src/models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ExtractJwt, Strategy as PassportJwtStrategy } from 'passport-jwt';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private passwordEnCoder: PasswordEncoder,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (
      !user ||
      !this.passwordEnCoder.comparePassword(user?.password, password)
    ) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: any) {
    return { username: payload.username };
  }
}

