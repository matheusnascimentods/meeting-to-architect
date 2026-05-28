import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AgentService } from './index.service';

@Controller('agents')
export class AgentController {
  constructor(private readonly agents: AgentService) { }

  @Post('generate')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        if (!file || !file.originalname) return cb(new BadRequestException('Invalid file'), false);

        const ext = file.originalname.split('.').pop()?.toLowerCase();
        const allowedExts = ['pdf', 'md'];

        if (ext && allowedExts.includes(ext)) cb(null, true);
        else cb(new BadRequestException('Only PDF and MD files are allowed'), false);
      },
    }),
  )
  async generate(
    @UploadedFile() file: Express.Multer.File,
    @Body('diagramType') diagramType: 'sequence' | 'c4' | 'class',
    @Req() req: any,
  ) {
    if (!file) throw new BadRequestException('File is required');
    const userId = req.user.sub;

    return this.agents.generateDiagram(file, diagramType, userId);
  }
}
