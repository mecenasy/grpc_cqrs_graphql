import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserResponse } from './response/create-user.response';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('user')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Public()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    type: CreateUserResponse,
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: 403,
    description: 'Wrong email or phone number, or user already exists',
  })
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() body: CreateUserDto) {
    return new CreateUserResponse(await this.userService.create(body));
  }
}
