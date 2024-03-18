import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    // read the metadata from the controller
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!validRoles || validRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) throw new BadRequestException('User not found (guard)');

    // check if the user has the role
    //* forearch dont have a return in scope
    for (const role of user.roles) {
      if (validRoles.includes(role)) return true;
    }

    throw new ForbiddenException(
      `User ${user.name} need a valid role to access this route [ ${validRoles} ]`,
    );
  }
}
