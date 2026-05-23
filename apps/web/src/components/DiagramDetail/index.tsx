import { Label, Button, IconButton } from "@primer/react";
import { ClockIcon, PersonIcon, CopyIcon, DownloadIcon, TrashIcon } from "@primer/octicons-react";
import { Diagram } from "../../types";
import { PanelBox } from "../PanelBox";
import { PanelHeader } from "../PanelHeader";
import { MermaidPreview } from "../MermaidPreview";
import "./styles.css";

const mermaidSources: Record<string, string> = {
  Sequence: `sequenceDiagram
    participant U as User
    participant A as Auth Service
    participant DB as Database
    participant T as Token Service

    U->>A: POST /login {email, password}
    A->>DB: Query user by email
    DB-->>A: User record
    A->>A: Validate password hash
    A->>T: Generate JWT token
    T-->>A: Signed JWT
    A-->>U: 200 OK {token, expiresIn}`,
  Flowchart: `flowchart TD
    A[Developer Push] --> B{CI Triggered}
    B --> C[Run Unit Tests]
    C --> D{Tests Pass?}
    D -- No --> E[Notify Developer]
    D -- Yes --> F[Build Docker Image]
    F --> G[Push to Registry]
    G --> H[Deploy to Staging]
    H --> I{Smoke Tests}
    I -- Fail --> J[Rollback]
    I -- Pass --> K[Deploy to Production]`,
  Class: `classDiagram
    class Order {
        +String id
        +String status
        +Date createdAt
        +calculateTotal()
        +cancel()
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
        +placeOrder()
    }
    Customer "1" --> "0..*" Order
    Order "1" --> "1..*" OrderItem`,
  Entity: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : included_in
    CUSTOMER {
        string id PK
        string name
        string email
    }
    ORDER {
        string id PK
        string customerId FK
        date createdAt
        string status
    }`,
};

interface DiagramDetailProps {
  diagram: Diagram;
}

export function DiagramDetail({ diagram }: DiagramDetailProps) {
  const source = mermaidSources[diagram.type] ?? mermaidSources.Sequence;

  return (
    <div className="diagram-detail-container">
      <div className="diagram-detail-type">
        <Label variant={diagram.variant}>{diagram.type}</Label>
      </div>
      <h1 className="diagram-detail-title">
        {diagram.title}
      </h1>
      <div className="diagram-detail-meta">
        <span className="meta-item">
          <ClockIcon size={14} />
          <span>Generated {diagram.date}</span>
        </span>
        <span>·</span>
        <span className="meta-item">
          <PersonIcon size={14} />
          <span>{diagram.author}</span>
        </span>
      </div>
      <div className="diagram-detail-actions">
        <Button leadingVisual={CopyIcon}>Copy Mermaid</Button>
        <Button leadingVisual={DownloadIcon}>Export</Button>
        <Button variant="danger" leadingVisual={TrashIcon}>Delete</Button>
      </div>

      <div className="m2a-detail-grid">
        <PanelBox>
          <PanelHeader
            left={<span className="panel-label">Preview</span>}
            right={<Label>Mermaid</Label>}
          />
          <MermaidPreview source={source} id={diagram.id} />
        </PanelBox>

        <PanelBox>
          <PanelHeader
            left={<span className="panel-label">Mermaid Source</span>}
            right={<IconButton icon={CopyIcon} aria-label="Copy source" variant="invisible" size="small" />}
          />
          <pre className="mermaid-source">
            <code>
              {source}
            </code>
          </pre>
        </PanelBox>
      </div>
    </div>
  );
}
