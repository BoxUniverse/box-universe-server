import { ArgsType, Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { IsObjectId } from '@common/decorators';
import { PayloadMessageNotification } from '@src/notifications';

export namespace NotificationInput {
  @ObjectType()
  export class NotificationDto {
    @Field(() => String)
    type: string;

    @Field(() => String)
    action: string;

    @Field(() => PayloadMessageNotification)
    message: PayloadMessageNotification;

    @Field(() => Boolean, {
      nullable: false,
      defaultValue: false,
    })
    isRead: boolean;
  }
  @InputType()
  @ArgsType()
  export class Notify extends OmitType(NotificationDto, ['isRead'] as const, InputType) {}
}
