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
import { DataSource, In, Repository } from 'typeorm';
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
    // DataSource is full control over the transaction.
    private readonly dataSource: DataSource,
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

  async findAll(query: PaginationDto): Promise<any[]> {
    const {
      limit = 3,
      genders = ['men', 'women', 'kids', 'unisex'],
      offset = 0,
    } = query;
    const products = await this.productsRepository.find({
      // take is the limit from typeorm
      take: limit,
      where: {
        gender: In(genders),
      },
      skip: offset,
    });

    return products.map((product) => ({
      ...product,
      images: product.images.map(({ url }) => url),
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productsRepository.findOneBy({
        id: term,
      });
    } else {
      const queryBuilder =
        this.productsRepository.createQueryBuilder('product');
      //! when use queryBuilder you can create alias for the table
      product = await queryBuilder
        .where('UPPER(title) = :title', { title: term.toUpperCase() })
        .orWhere('slug = :slug', { slug: term.toLowerCase() })
        .leftJoinAndSelect('product.images', 'images')
        .getOne();

      // product = await this.productsRepository.findOne({
      //   where: [{ slug: term.toLowerCase() }, { title: term.toUpperCase() }],
      //   relations: {
      //     images: true,
      //   },
      // });
      // or use where (slug =:term or UPPER(title) =:term,
      // { title: term.toUpperCase(), slug: term.toLowerCase()})
    }

    if (!product)
      throw new NotFoundException(
        `Product with term ${term} not found | slug or id`,
      );

    return product;
  }

  async findOnePlane(term: string) {
    const product = await this.findOne(term);
    return {
      ...product,
      images: product.images.map(({ url }) => url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productsRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        // remove images
        await queryRunner.manager.delete(ProductImages, {
          product: { id },
        });
        product.images = images.map((image) =>
          this.productImagesRepository.create({ url: image }),
        );
      }
      // not have inpact in the database
      await queryRunner.manager.save(product);
      // await this.productsRepository.save(product);
      // commit transaction
      await queryRunner.commitTransaction();
      // close query runner
      await queryRunner.release();
      return this.findOnePlane(id);
    } catch (error) {
      // rollback transaction if error
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
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
