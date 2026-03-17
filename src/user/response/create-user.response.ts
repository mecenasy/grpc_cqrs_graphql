import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateUserResponse {
  constructor(private readonly partial?: Partial<CreateUserResponse>) {
    Object.assign(this, partial);
  }

  @Expose()
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Your email address',
    example: 'example@example.com',
    required: true,
  })
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsPhoneNumber()
  @ApiProperty({
    type: String,
    description: 'Phone number',
    example: '+998901234567',
    required: true,
  })
  phone: string;
}
