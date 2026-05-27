# Diagram Generation Rules

These rules apply to all diagram types and must always be respected.

## General rules

- Generate only valid Mermaid syntax
- Do not include markdown code fences (no triple backticks)
- Do not add any explanation before or after the diagram code
- Do not invent components, actors, or interactions that were not present in the structured context
- Use clear, short labels — avoid full sentences as node labels
- If a piece of information is ambiguous, simplify rather than guess

## Naming conventions

- Use PascalCase for component and service names (e.g. AuthService, UserDB)
- Use camelCase for action labels (e.g. validateToken, fetchUser)
- Actors that represent end users should be labeled as "User" or "Client"

## Quality rules

- Every component mentioned in the context must appear in the diagram
- Every interaction listed must be represented
- The diagram must be self-explanatory without needing the original transcript