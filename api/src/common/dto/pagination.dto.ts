import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(['men', 'women', 'kids', 'unisex'], { each: true })
  genders?: string[];
}
