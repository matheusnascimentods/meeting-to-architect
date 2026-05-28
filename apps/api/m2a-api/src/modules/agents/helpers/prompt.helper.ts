import { readFileSync } from 'fs'
import { join } from 'path'

export function loadPrompt(filename: string): string {
    return readFileSync(join(__dirname, '..', '..', 'prompts', filename), 'utf-8')
}