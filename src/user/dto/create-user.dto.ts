import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description:
      'Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character, If you not provide password then password will be "Pass123#" and you mast change it in first login',
    example: 'Pass123#',
    required: false,
  })
  @IsOptional()
  @MinLength(8)
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least 1 uppercase letter',
  })
  @Matches(/[0-9]/, {
    message: 'Password must contain at least 1 number',
  })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least 1 special character',
  })
  password: string;

  @ApiProperty({
    type: String,
    description: 'Your email address',
    example: 'example@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Phone number',
    example: '+998901234567',
    required: true,
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}
