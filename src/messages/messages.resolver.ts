import { Authorization } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { S3Service } from '@src/s3';
import { Current } from '@src/users';
import { Message, MessageInput, MessagesConversation, MessagesService } from '@src/messages';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
@UseGuards(AuthGuard)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly s3Service: S3Service,
  ) {}
  @Mutation(() => Message, {
    name: 'sendMessage',
    nullable: true,
  })
  async sendMessage(
    @Args({ name: 'payload', type: () => MessageInput.Send }) payload: MessageInput.Send,
    @Authorization()
    user: Current,
  ): Promise<Message> {
    return this.messagesService.sendMessage(payload, user._id.toString());
  }

  @Query(() => MessagesConversation, {
    name: 'getMessagesByConversationId',
    nullable: true,
  })
  async getMessagesByConversationId(
    @Args({ name: 'payload', type: () => MessageInput.PaginationMessages })
    payload: MessageInput.PaginationMessages,
  ) {
    const x = await this.messagesService.getMessagesByConversationId(
      payload.conversationId,
      payload.startValue,
    );
    console.log(x);
    return x;
  }

  @Mutation(() => Message, {
    name: 'sendFiles',
    nullable: true,
  })
  async sendMultipleFiles(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: Promise<FileUpload>[],
    @Args({ name: 'payload', type: () => MessageInput.SendFiles }) payload: MessageInput.SendFiles,
    @Authorization()
    user: Current,
  ) {
    const resultFiles = await Promise.all(files);
    const aPromises = [];
    for (const file of resultFiles) {
      aPromises.push(this.s3Service.uploadImage(file));
    }
    // console.log(await Promise.all(aPromises));
    return this.messagesService.sendFiles(
      await Promise.all(aPromises),
      user._id.toString(),
      payload.conversationId,
      payload.now,
    );
  }
}
