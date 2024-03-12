import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-update.dto';

export class UpdateAuthDto extends PartialType(CreateUserDto) {}
