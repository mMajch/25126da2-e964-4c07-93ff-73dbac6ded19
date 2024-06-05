import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  startDate: Date;

  @Column('simple-json')
  messages: { role: string; content: string }[];
}
