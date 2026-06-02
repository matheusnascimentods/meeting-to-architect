import { BadRequestException } from '@nestjs/common';

export function getFile(file: Express.Multer.File) {
  const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

  if (fileExtension === 'md') {
    return {
      type: 'text',
      text: file.buffer.toString('utf-8'),
    };
  }

  if (fileExtension === 'pdf') {
    return {
      type: 'inlineData',
      inlineData: {
        mimeType: 'application/pdf',
        data: file.buffer.toString('base64'),
      },
    };
  }

  throw new BadRequestException(
    `Unsupported file type: .${fileExtension ?? 'unknown'}`,
  );
}
