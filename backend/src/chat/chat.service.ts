import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageDto } from './dto/create-chat-completion.request';
import { ChatCompletionMessageParam } from 'openai/resources';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';

enum ROLE {
  USER = 'user',
  SYSTEM = 'system',
}

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
    message: string,
  ): Promise<Chat> {
    const prompt = {
      role: ROLE.SYSTEM,
      content:
        'You are a helpful and friendly chatbot designed to assist older users. Use simple, clear language and be patient. Avoid using technical jargon. Always be polite, respectful, and supportive. Use short sentences and offer assistance proactively.',
    };
    const userMessage = {
      role: ROLE.USER,
      content: message,
    };
    const messages = [prompt, userMessage];
    const openaiResponse = await this.createChatCompletion(messages);
    const chat = this.chatRepository.create({
      userId,
      startDate,
      messages: [...messages, openaiResponse],
    });

    const savedChat = await this.chatRepository.save(chat);
    return this.stripChatFromPrompt(savedChat);
  }

  async updateChat(id: number, message: string): Promise<Chat> {
    const chat = await this.chatRepository.findOne({ where: { id } });
    const userMessage = {
      role: ROLE.USER,
      content: message,
    };
    const openaiResponse = await this.createChatCompletion([
      ...chat.messages,
      userMessage,
    ]);
    await this.chatRepository.update(id, {
      messages: [...chat.messages, userMessage, openaiResponse],
    });

    const savedChat = await this.chatRepository.findOne({ where: { id } });
    return this.stripChatFromPrompt(savedChat);
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

  // we do not want frontend to see the prompt
  stripChatFromPrompt(chat: Chat) {
    return {
      ...chat,
      messages: chat.messages.filter(({ role }) => role !== ROLE.SYSTEM),
    };
  }
}
