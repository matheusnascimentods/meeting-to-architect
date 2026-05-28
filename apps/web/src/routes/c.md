# System Architecture Review — C4 Model Definition
Date: 27/05/2026
Participants: Matheus (Tech Lead), Brenno (Backend Dev), Ana (Frontend Dev)

Matheus opened the meeting to establish the C4 architecture model for the M2A platform. He explained that they would define the system context, identify all containers, and map out the key components within each container.

Starting with the System Context level, Matheus defined the external actors and the main system boundary. The primary user is an Engineer who interacts with the M2A Platform to upload meeting transcripts and view generated architecture diagrams. The Engineer uses the M2A Platform through a web browser. The M2A Platform itself is the central system being designed. It integrates with two external systems: the GitHub API, which provides source code context and pull request information, and the Gemini API, which is the large language model service used for analyzing transcripts and generating diagrams.

Moving to the Container level, Brenno described the internal structure of the M2A Platform. The system is decomposed into four main containers. The first container is the Web Application, a React-based single-page application that runs in the Engineer's browser. The Web Application communicates with the API Server via HTTP REST calls. The second container is the API Server, a NestJS backend that handles all business logic, orchestration, and data persistence. The API Server communicates with both the Database and the external Gemini API.

The third container is the Database, a PostgreSQL instance hosted on Supabase that stores all persistent data including users, transcripts, diagrams, and execution logs. The fourth container is the Message Queue, which Brenno mentioned would be added in a future phase for asynchronous diagram generation, but for the MVP the diagram generation happens synchronously within the API Server.

Ana asked about how the API Server communicates with Gemini. Brenno explained that the API Server uses the Google ADK library to instantiate agents that make requests to the Gemini API. The Gemini API processes the transcript content and returns structured JSON responses containing the diagram code and metadata. Brenno emphasized that all calls to Gemini are made from the backend, never from the frontend, to keep the API key secure.

Regarding the GitHub integration, Matheus explained that in future phases the system should be able to fetch context from GitHub repositories linked by users. For now, this container is not active. When it is implemented, the API Server will make authenticated requests to the GitHub API to retrieve pull request details and code context that can enrich the diagram generation process.

Matheus summarized the data flows between containers. The Engineer uses the Web Application to upload a transcript file and select a diagram type. The Web Application sends a POST request to the API Server with the file and diagram type. The API Server extracts the file, calls the Gemini API through the ADK agents, receives the generated Mermaid code, and stores the result in the Database. The API Server then returns the diagram to the Web Application, which renders it for the Engineer to view.

Ana confirmed that the Web Application also needs to display a list of all diagrams the Engineer has previously generated. Brenno confirmed that the API Server exposes a GET endpoint that queries the Database and returns all diagrams for the authenticated user.

Brenno added that the API Server also logs every interaction with Gemini in the Database for debugging and cost tracking purposes. Each time an agent runs, metadata like tokens used, processing time, and success status are recorded.

Matheus concluded the meeting by confirming that the C4 model clearly shows that the M2A Platform is a three-tier system: the Web Application tier for user interaction, the API Server tier for business logic and orchestration, and the Database tier for persistence. All external integrations happen at the API Server level, which acts as a gateway protecting sensitive data and API keys.