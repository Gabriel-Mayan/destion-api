import { IsString, IsUUID, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateChatDto {
  @IsString()
  title: string;

  @IsUUID()
  creatorId: string;

  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  participantIds: string[];
}
