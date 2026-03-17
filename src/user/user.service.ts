import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  logger: Logger;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.logger = new Logger(UserService.name);
  }

  public async create({ email, phone }: CreateUserDto): Promise<User> {
    let user = await this.findOne(email);

    if (user && user.phone) {
      const data = this.userRepository.createQueryBuilder('user').getMany();
      this.logger.error(
        `User with email ${email} or phone ${phone} already exists.`,
        user,
        data,
      );
      throw new BadRequestException('User already exists');
    }

    if (!user) {
      user = this.userRepository.create({
        email,
        phone,
      });
    } else {
      user.phone = phone;
    }

    await this.save(user);

    return user;
  }

  public async findById(id: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOneOrFail();
  }

  public async findOne(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.socialAccounts', 'social')
      .where('user.email = :email', { email })
      .getOne();
  }

  public async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  findAll() {
    console.log('findAll');
  }

  update() {
    console.log('update');
  }

  delete() {
    console.log('delete');
  }
}
