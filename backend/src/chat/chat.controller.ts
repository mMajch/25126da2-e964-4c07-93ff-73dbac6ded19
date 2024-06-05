import { Body, Controller, Post, Get, Param, Put } from '@nestjs/common';
import { ChatCompletionMessageDto } from './dto/create-chat-completion.request';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';

const userId = 'userId-1';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Get('')
  getChatsByUserId(): Promise<Chat[]> {
    return this.chatService.getChatsByUserId(userId);
  }

  @Get(':id')
  getChatById(@Param('id') id: number): Promise<Chat> {
    return this.chatService.getChatById(id);
  }

  @Post()
  createChat(
    @Body()
    chatData: {
      message: string;
    },
  ): Promise<Chat> {
    return this.chatService.createChat(userId, new Date(), chatData.message);
  }

  @Put(':id')
  updateChat(
    @Param('id') id: number,
    @Body()
    chatData: {
      message: string;
    },
  ): Promise<Chat> {
    return this.chatService.updateChat(id, chatData.message);
  }
}
