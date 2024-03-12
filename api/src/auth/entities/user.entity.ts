import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  name: string;

  @Column('uuid')
  password: string;
  @Column('bool', {
    default: true,
  })
  isActivated: boolean;
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];
}
