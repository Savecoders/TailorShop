import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  loginUser(@Body() loginAuthDto: LoginUserDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') email: string,
    @RawHeaders() headers: any,
  ) {
    console.log(headers);
    return {
      ok: true,
      message: 'This is a private route',
      user,
      email,
    };
  }

  @Get('protected')
  @RoleProtected(ValidRoles.ADMIN, ValidRoles.USER)
  @UseGuards(AuthGuard(), UserRoleGuard)
  protectedRoute(@GetUser() user: User) {
    return {
      ok: true,
      message: 'This is a protected route',
      user,
    };
  }

  @Get('virefied')
  @Auth(ValidRoles.ADMIN)
  virefiedRoute(@GetUser() user: User) {
    return {
      ok: true,
      message: 'This is a protected route',
      user,
    };
  }
}
