import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['slug']),
) {}

// not omitting slug
// export class UpdateProductDto extends PartialType(
//   CreateProductDto
// ) {}
