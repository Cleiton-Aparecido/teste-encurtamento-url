import { IsUrl, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Matches, IsOptional, IsString } from 'class-validator';

export class UrlDto {
  @ApiPropertyOptional({
    example: 'https://www.youtube.com/',
    description: 'URL original que será encurtada',
  })
  @IsUrl(
    { require_protocol: true, protocols: ['http', 'https'] },
    { message: 'URL inválida. Use http:// ou https://' },
  )
  @MaxLength(2048)
  originalUrl: string;

  @ApiPropertyOptional({
    example: 'meu-link',
    description:
      'customLink customizado (opcional, apenas para usuários autenticados). 3-30 chars [a-z0-9_-]',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9_-]{3,30}$/, {
    message:
      'customLink inválido. Use apenas letras minúsculas, números, "-" ou "_", de 3 a 30 caracteres.',
  })
  customLink?: string;
}
