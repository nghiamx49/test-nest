import { Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSchema, User } from 'src/models/user.schema';
import { UserService } from 'src/services/user.services';
import { UserController } from 'src/controllers/user.controller';
import { NextFunction } from 'express';
import * as CryptoJS from 'crypto-js';
import { PasswordEncoder } from 'src/utils/crypto.util';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/middlewares/authenticate.middleware';
import {  JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [UserService, LocalStrategy, PasswordEncoder],
  controllers: [UserController],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
})
export class UserModule {}