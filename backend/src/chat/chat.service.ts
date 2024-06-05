import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageDto } from './dto/create-chat-completion.request';
import { ChatCompletionMessageParam } from 'openai/resources';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private readonly openai: OpenAI,
  ) {}

  async getChatsByUserId(userId: string): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { userId },
      select: ['id', 'userId', 'startDate'],
    });
  }

  async getChatById(id: number): Promise<Chat> {
    return this.chatRepository.findOne({ where: { id } });
  }

  async createChat(
    userId: string,
    startDate: Date,
    message: ChatCompletionMessageDto,
  ): Promise<Chat> {
    const openaiResponse = await this.createChatCompletion([message]);
    const chat = this.chatRepository.create({
      userId,
      startDate,
      messages: [message, openaiResponse],
    });
    return this.chatRepository.save(chat);
  }

  async updateChat(
    id: number,
    messages: ChatCompletionMessageDto[],
  ): Promise<Chat> {
    const openaiResponse = await this.createChatCompletion(messages);
    await this.chatRepository.update(id, {
      messages: [...messages, openaiResponse],
    });
    return this.chatRepository.findOne({ where: { id } });
  }

  async createChatCompletion(messages: ChatCompletionMessageDto[]) {
    const response = await this.openai.chat.completions.create({
      messages: messages as ChatCompletionMessageParam[],
      model: 'gpt-4',
    });

    const choice = response?.choices[0];
    return {
      role: choice?.message.role,
      content: choice?.message.content,
    };
  }
}
