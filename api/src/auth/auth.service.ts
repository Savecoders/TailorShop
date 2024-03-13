import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto, UpdateAuthDto, LoginUserDto } from './dto/';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly AuthRespository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateUserDto) {
    try {
      const saltOrRounds = 10;
      const { password, ...rest } = createAuthDto;
      const user = this.AuthRespository.create({
        ...rest,
        password: bcrypt.hashSync(password, saltOrRounds),
      });

      await this.AuthRespository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ email: user.email }),
      };
    } catch (error) {
      this.handleDBErros(error);
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.AuthRespository.findOne({
      where: {
        email,
      },
      select: {
        password: true,
        email: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    return {
      ...user,
      token: this.getJwtToken({ email: user.email }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErros(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('Email already exists');
    }
    throw new InternalServerErrorException('Please checks server logs');
  }
}
