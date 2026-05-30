import { Agent, Gemini, AgentTool } from '@google/adk';
import { loadPrompt } from '../helpers/prompt.helper';
import { createTranscriptAnalyzerAgent } from './transcript-analyzer.agent';
import { createUmlArchitectAgent } from './uml-architect.agent';
import { createC4ArchitectAgent } from './c4-architect.agent';

export function createSoftwareArchitectAgent(gemini: Gemini): Agent {
  const transcriptAnalyzer = createTranscriptAnalyzerAgent(gemini);
  const umlArchitect = createUmlArchitectAgent(gemini);
  const c4Architect = createC4ArchitectAgent(gemini);

  return new Agent({
    name: 'software-architect',
    description:
      'Main Software Architect agent that coordinates document analysis and delegates diagram generation to specialized UML and C4 agents',
    model: gemini,
    instruction: loadPrompt('software-architect.md'),
    tools: [
      new AgentTool({ agent: transcriptAnalyzer }),
      new AgentTool({ agent: umlArchitect }),
      new AgentTool({ agent: c4Architect }),
    ],
  });
}
