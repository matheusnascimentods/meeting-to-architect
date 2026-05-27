# Sequence Diagram — Generation Prompt

Generate a Mermaid sequence diagram based on the structured context provided.

## Syntax rules

- Start with `sequenceDiagram` on the first line
- Declare all participants explicitly using `participant X as Label`
- Use `->>` for requests and calls
- Use `-->>` for responses and returns
- Use `Note over X: text` sparingly, only for critical decisions
- Do not use `activate` / `deactivate` unless the context explicitly describes async or concurrent flows

## Structure rules

- Order participants left to right: external actors first, then internal services, then databases
- Order interactions chronologically as they appear in the context
- Group related interactions with `rect rgb(240, 240, 240)` only if there are clearly distinct phases

## Example of expected output

sequenceDiagram
    participant U as User
    participant A as AuthService
    participant DB as Database
    participant T as TokenService

    U->>A: POST /login {email, password}
    A->>DB: Query user by email
    DB-->>A: User record
    A->>A: Validate password hash
    A->>T: Generate JWT
    T-->>A: Signed token
    A-->>U: 200 OK