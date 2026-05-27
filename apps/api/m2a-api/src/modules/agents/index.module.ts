import { Module } from '@nestjs/common'
import { AgentService } from './index.service'
import { AgentController } from './index.controller'

@Module({
    providers: [AgentService],
    controllers: [AgentController],
    exports: [AgentService],
})
export class AgentsModule { }