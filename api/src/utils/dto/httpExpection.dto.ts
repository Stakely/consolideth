import { ApiProperty } from '@nestjs/swagger';

export class HttpExceptionResponse {
  @ApiProperty({ example: 400, description: 'The HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: 'Bad Request',
    description: 'The HTTP status message',
    required: false,
  })
  message: string | string[] | null;

  @ApiProperty({
    example: 'Bad request error message',
    description: 'Error description',
  })
  error: string | null;
}
