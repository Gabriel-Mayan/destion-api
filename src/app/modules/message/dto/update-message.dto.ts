import { IsString, IsUUID } from 'class-validator';

export class UpdateMessageDto {
  @IsUUID()
  messageId: string;

  @IsString()
  content: string;
}
