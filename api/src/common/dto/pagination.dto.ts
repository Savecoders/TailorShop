import { IsIn, IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsIn(['men', 'women', 'kids', 'unisex'])
  gender?: string;
}
