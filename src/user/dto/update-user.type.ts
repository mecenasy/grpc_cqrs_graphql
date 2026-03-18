import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserType {
  @Field(() => ID)
  id: string;

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
