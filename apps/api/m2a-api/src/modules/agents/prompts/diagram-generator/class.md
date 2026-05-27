# Class Diagram — Generation Prompt

Generate a Mermaid class diagram based on the structured context provided.

## Syntax rules

- Start with `classDiagram`
- Define each class with its attributes and methods
- Use `+` for public, `-` for private, `#` for protected members
- Use correct Mermaid relationship syntax:
  - `A --|> B` for inheritance
  - `A --* B` for composition
  - `A --o B` for aggregation
  - `A --> B` for association
  - `A .. B` for dependency
- Add cardinality where relevant using `"1"` and `"0..*"` notation

## Structure rules

- Only include classes that were explicitly mentioned in the context
- Attributes must reflect the data discussed in the meeting
- Methods must reflect the actions or behaviors described
- If the meeting only discussed high-level structure, generate the class skeleton without methods
- Group related classes visually by ordering them together in the output

## Example of expected output

classDiagram
    class Order {
        +String id
        +String status
        +Date createdAt
        +calculateTotal() float
        +cancel() void
    }
    class OrderItem {
        +String productId
        +int quantity
        +float unitPrice
    }
    class Customer {
        +String id
        +String name
        +String email
        +placeOrder() Order
    }

    Customer "1" --> "0..*" Order : places
    Order "1" --> "1..*" OrderItem : contains