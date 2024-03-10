import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductImages } from './entities/';
import { In, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    // pattern repository
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(ProductImages)
    private readonly productImagesRepository: Repository<ProductImages>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // this implement in the entity
      // if (!createProductDto.slug) {
      //   createProductDto.slug = createProductDto.title
      //     .toLowerCase()
      //     .replaceAll(' ', '_')
      //     .replaceAll("'", '');
      // }

      const { images = [], ...productDetails } = createProductDto;

      const product = this.productsRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImagesRepository.create({ url: image }),
        ),
      });
      await this.productsRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(query: PaginationDto): Promise<Product[]> {
    const {
      limit = 3,
      genders = ['men', 'women', 'kids', 'unisex'],
      offset = 0,
    } = query;
    return await this.productsRepository.find({
      // take is the limit from typeorm
      take: limit,
      where: {
        gender: In(genders),
      },
      skip: offset,
      relations: {
        images: true,
      },
    });
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productsRepository.findOne({
        where: { id: term },
        relations: {
          images: true,
        },
      });
    } else {
      // const queryBuilder = this.productsRepository.createQueryBuilder();
      // product = await queryBuilder
      //   .where('UPPER(title) = :title', { title: term.toUpperCase() })
      //   .orWhere('slug = :slug', { slug: term.toLowerCase() })
      //   .getOne();

      product = await this.productsRepository.findOne({
        where: [{ slug: term.toLowerCase() }, { title: term.toUpperCase() }],
        relations: {
          images: true,
        },
      });
      // or use where (slug =:term or UPPER(title) =:term,
      // { title: term.toUpperCase(), slug: term.toLowerCase()})
    }

    if (!product)
      throw new NotFoundException(
        `Product with term ${term} not found | slug or id`,
      );

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const { affected } = await this.productsRepository.update(id, {
        ...updateProductDto,
        images: [],
      });
      if (affected === 0)
        throw new BadRequestException(`Product with id ${id} not found`);
    } catch (error) {
      this.handleDBExceptions(error);
    }
    return;
  }

  async remove(id: string) {
    // return await this.productsRepository.delete(id).then((res) => {
    //   if (res.affected === 0)
    //     throw new BadRequestException(`Product with id ${id} not found`);
    //   return res;
    // });
    const { affected } = await this.productsRepository.delete(id);

    if (affected === 0)
      throw new BadRequestException(`Product with id ${id} not found`);

    return;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    // show the error in the console api
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error occurred, check server logs',
    );
  }
}
