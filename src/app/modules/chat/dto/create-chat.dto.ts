import { IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
  
  @IsBoolean()
  isPublic: boolean;
}
