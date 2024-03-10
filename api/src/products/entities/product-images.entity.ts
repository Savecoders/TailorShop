import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToMany(() => Product, (product) => product.images)
  product: Product;
}
