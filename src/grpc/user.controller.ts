import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { InjectRepository } from '@nestjs/typeorm';
import { Observable, of } from 'rxjs';
import type {
  UserIdentity,
  UserProxyServiceController,
  UserInfo,
  ValidateRequest,
  ValidateResponse,
  CreateUserRequest,
  UserList,
  UpdateUserRequest,
} from 'src/proto/user';
import { User } from 'src/user/entity/user.entity';
import { Like, Repository } from 'typeorm';

@Controller()
export class UserGrpcController implements UserProxyServiceController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @GrpcMethod('UserProxyService', 'ValidateUser')
  validateUser(data: ValidateRequest): Observable<ValidateResponse> {
    if (data.name.toLowerCase() === 'admin') {
      return of({
        isValid: false,
        message: 'Imię "Admin" jest zastrzeżone dla systemu.',
      });
    }

    if (!data.phone.startsWith('+48')) {
      return of({
        isValid: false,
        message: 'Obsługujemy tylko polskie numery telefonów (+48).',
      });
    }

    if (!data.email.includes('@')) {
      return of({
        isValid: false,
        message: 'Nieprawidłowy adres email.',
      });
    }

    return of({ isValid: true, message: 'OK' });
  }
  @GrpcMethod('UserProxyService', 'GetUser')
  async getUser(request: UserIdentity): Promise<UserInfo> {
    const user = await this.userRepository.findOneOrFail({
      where: [
        { id: request.id },
        { email: request.email },
        { phone: request.phone },
      ],
    });
    return { ...user, zip: user.zipCode, number: user.streetNumber };
  }

  @GrpcMethod('UserProxyService', 'CreateUser')
  async createUser(request: CreateUserRequest): Promise<UserInfo> {
    const user = this.userRepository.create({
      email: request.email,
      name: request.name,
      phone: request.phone,
      surname: request.surname,
      street: request.street,
      city: request.city,
      state: request.state,
      zipCode: request.zip,
      streetNumber: request.number,
    });

    await this.userRepository.save(user);

    return { ...user, zip: user.zipCode, number: user.streetNumber };
  }

  @GrpcMethod('UserProxyService', 'UpdateUser')
  async updateUser(request: UpdateUserRequest): Promise<UserInfo> {
    await this.userRepository.update(request.id, {
      email: request.email,
      name: request.name,
      phone: request.phone,
      surname: request.surname,
      street: request.street,
      city: request.city,
      state: request.state,
      zipCode: request.zip,
      streetNumber: request.number,
    });

    const user = await this.userRepository.findOneByOrFail({ id: request.id });

    return { ...user, zip: user.zipCode, number: user.streetNumber };
  }

  @GrpcMethod('UserProxyService', 'DeleteUser')
  async deleteUser(request: UserIdentity): Promise<UserIdentity> {
    await this.userRepository.delete(request.id);
    return {
      email: request.email || '',
      id: request.id || '',
      phone: request.phone || '',
    };
  }

  @GrpcMethod('UserProxyService', 'GetAllUsers')
  async getAllUsers(): Promise<UserList> {
    const users = await this.userRepository.find();
    return {
      users: users.map((user) => ({
        ...user,
        zip: user.zipCode,
        number: user.streetNumber,
      })),
    };
  }

  @GrpcMethod('UserProxyService', 'SearchUsers')
  async searchUsers(request: { query: string }): Promise<UserList> {
    const users = await this.userRepository.find({
      where: [
        { email: Like(`%${request.query}%`) },
        { name: Like(`%${request.query}%`) },
        { surname: Like(`%${request.query}%`) },
      ],
    });

    return {
      users: users.map((user) => ({
        ...user,
        zip: user.zipCode,
        number: user.streetNumber,
      })),
    };
  }
}
