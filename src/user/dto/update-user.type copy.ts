import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserType {
  @Field()
  email: string;

  @Field()
  phone: string;

  @Field()
  name: string;

  @Field()
  surname: string;

  @Field()
  street: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  zip: string;

  @Field()
  number: string;
}
