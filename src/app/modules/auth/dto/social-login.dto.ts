import { IsEmail, IsString, IsOptional } from 'class-validator';

export class SocialLoginDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString({ message: 'Name is required' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Avatar URL must be a string' })
  avatarUrl?: string;
}
