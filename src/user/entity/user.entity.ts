import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  name: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  surname: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  street: string;

  @Column({
    name: 'zip_code',
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  zipCode: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  city: string;

  @Column({
    name: 'street_number',
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  streetNumber: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  state: string;

  @Column({
    type: 'varchar',
    length: 15,
    unique: true,
    nullable: true,
  })
  @IsPhoneNumber()
  phone: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  admin: boolean;
}
