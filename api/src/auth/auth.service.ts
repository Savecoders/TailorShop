import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
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
  ) {}

  create(createAuthDto: CreateUserDto) {
    try {
      const saltOrRounds = 10;
      const { password, ...rest } = createAuthDto;
      const user = this.AuthRespository.create({
        ...rest,
        password: bcrypt.hashSync(password, saltOrRounds),
      });
      this.AuthRespository.save(user);
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

    const user = await this.AuthRespository.find({
      where: {
        email,
      },
      select: {
        password: true,
        email: true,
      },
    });

    if (user.length === 0) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    const isPasswordValid = bcrypt.compareSync(password, user[0].password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    return `This action returns a #${loginUserDto.email} auth`;
  }

  private handleDBErros(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('Email already exists');
    }
    throw new InternalServerErrorException('Please checks server logs');
  }
}
