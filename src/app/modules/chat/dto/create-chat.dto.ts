import { IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  creatorId: string;
  
  @IsBoolean()
  isPublic: boolean;
}
