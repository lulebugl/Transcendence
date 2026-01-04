ft_transcendence
A modern 3D Pong‑inspired web game built with a microservices architecture.
​
The project showcases a complete web stack (frontend, backend, database, real‑time features, user management and optional modules) as required by the ft_transcendence subject.
​

Description
ft_transcendence is a browser‑based multiplayer Pong game with 3D visuals, designed for real‑time matches between users.
​
Players can create accounts, manage their profiles, play online games, and benefit from additional features depending on the chosen modules (e.g. tournaments, statistics, chat, AI opponent, etc.).
​

Key features
Secure user authentication and account management (signup, login, profile, avatar, friends, etc.).
​

Real‑time multiplayer Pong matches with smooth synchronisation between players.
​

Modular architecture allowing optional features like tournaments, statistics, advanced chat, or AI opponent.
​

Instructions
Prerequisites
Node.js 20+ and pnpm 9+.
​

Docker 24+ (and Docker Compose / compatible tooling).
​

A .env file created from .env.example with all required environment variables (database, secrets, etc.).
​

Installation
Clone the repository and enter the project directory:

bash
git clone <repository_url>
cd ft_transcendence
``` [1]  
Install dependencies and build all apps:

bash
pnpm install
pnpm -r build
``` [1][1]  
Create and configure your environment file:

bash
cp .env.example .env
Then fill in the required values (database credentials, JWT secrets, API keys, etc.).
​

Running the project
Run locally with Docker (nginx on localhost:8080):

bash
make build
make up
Main endpoints:

Frontend: http://localhost:8080/
​

Backend health: http://localhost:8080/api/health
​

Team Information
Team members
login1 – Roles: Product Owner (PO), Developer

Responsibilities: product vision (3D Pong experience), feature prioritisation, backlog management, validation of game‑related features, implementation of assigned frontend/backend parts.
​

login2 – Roles: Project Manager (PM), Developer

Responsibilities: planning and tracking, task distribution, meeting coordination, risk management, implementation of features such as deployment or orchestration.
​

login3 – Roles: Technical Lead, Developer

Responsibilities: architecture of the microservices system, technology stack decisions, critical code reviews, implementation of core services and real‑time communication layer.
​

login4 – Roles: Developer

Responsibilities: implementation of game features, UI components, tests, and documentation of their components.
​

login5 – Roles: Developer

Responsibilities: implementation of backend endpoints, database logic, performance improvements, and bug fixing.
​

Project Management
Work organisation: project split into user stories and technical tasks (game logic, auth, chat, deployment, etc.), each assigned to specific logins.
​

Management tools: Notion for documentation and planning, plus <GitHub Issues / Projects / Trello> for tracking tasks and bugs.
​

Communication: <Discord / Slack / other> for daily coordination and regular sync meetings.
​

Technical Stack
Frontend: <e.g. React / Vue / Svelte / Three.js for 3D rendering>, styled with <Tailwind CSS / other>.
​

Backend: <e.g. NestJS / Express / other> exposing REST APIs and handling game/session logic.
​

Database: <PostgreSQL / MySQL / other> with a clear schema for users, matches, friendships, and other entities.
​

Real‑time: WebSockets (e.g. Socket.IO) to synchronise game state between players in real time.
​

Architecture: Microservices, containerised with Docker and orchestrated through Docker Compose / Makefile commands.
​

Rationale

The chosen frontend stack enables a responsive UI and 3D rendering suitable for a modern Pong experience.
​

The backend framework and microservices architecture allow clear separation of concerns (auth, game, gateway, etc.) and easier scaling.
​

The database and ORM provide reliable persistence of users, matches and statistics with well‑defined relations.
​

Database Schema
Example structure (adapt to your actual schema):

users: id, login, email, password hash, avatar, status, created_at, updated_at.
​

friends: id, requester_id, addressee_id, status, created_at.
​

matches: id, player1_id, player2_id, score_p1, score_p2, started_at, finished_at, mode.
​

messages: id, sender_id, receiver_id / channel_id, content, created_at.
​

Relationships:

One user can have many matches (as player1 or player2) and many friends.
​

One match is linked to two users (or more if additional modes are implemented), and optional tournament data.
​

You can also add a diagram (e.g. PNG or SVG in the repo) to visualise the schema.
​

Features List
3D Pong game – implemented by <logins>

Real‑time multiplayer 3D Pong matches with clear rules and win/loss conditions.
​

User authentication & profiles – implemented by <logins>

Signup, login, secure password storage, profile management, avatar upload or selection.
​

Friends system – implemented by <logins>

Send and accept friend requests, see friends list and online status.
​

Real‑time communication – implemented by <logins>

WebSocket‑based updates for game state and, if implemented, chat or live notifications.
​

Deployment with Docker – implemented by <logins>

Containerised services (frontend, backend, gateway, database) runnable with a single command through Makefile.
​

Add any other features (tournaments, AI opponent, stats, etc.) in the same format.
​

Modules
Fill this table with your real modules and points once final; example for a 3D Pong project:
​

Category	Module	Type	Points	Implemented by	Notes / Implementation
Gaming & UX	Web‑based game	Major	2	<logins>	Core Pong game playable in the browser. 
​
Gaming & UX	Remote players	Major	2	<logins>	Two players on separate machines playing in real time. 
​
Gaming & UX	Tournament system	Minor	1	<logins>	Bracket management and tournament matchmaking. 
​
Web	Frontend + backend frameworks	Major	2	<logins>	Framework used on both frontend and backend. 
​
Web	ORM	Minor	1	<logins>	Database handled via ORM (migrations, relations). 
​
User Management	Standard user management	Major	2	<logins>	Auth, profiles, avatars, friends, online status. 
​
Artificial Intelligence	AI Opponent (if implemented)	Major	2	<logins>	Non‑perfect but challenging AI opponent for Pong. 
​
Gaming & UX	Game customization (if any)	Minor	1	<logins>	Power‑ups, maps, or custom settings. 
​
Total points: at least 14 (update once your module list is final).
​

Individual Contributions
login1

Roles: Product Owner, Developer.
​

Contributions: e.g. game concept and scope, feature prioritisation, user flows, implementation of profile and friends features, polishing of UX.
​

login2

Roles: Project Manager, Developer.
​

Contributions: e.g. planning, task tracking, Makefile and Docker workflows, orchestration of microservices, some backend endpoints.
​

login3

Roles: Technical Lead, Developer.
​

Contributions: e.g. architecture of services, WebSocket layer, 3D game core, critical code reviews, security and performance decisions.
​

login4

Roles: Developer.
​

Contributions: e.g. frontend UI for game and menus, integration with 3D engine, responsiveness, tests and bug fixing in their scope.
​

login5

Roles: Developer.
​

Contributions: e.g. database schema, statistics or history endpoints, logging, monitoring hooks, refactoring and documentation.
​

Assets
Main visual references and assets:

https://images.squarespace-cdn.com/content/62d66fa29e72c560f8efc020/1cd27e3d-e6bc-4bfe-99bd-fae5365f4ae2/NozomiCitadel_Zipline_Before%281%29.png?content-type=image%2Fpng
​

Resources
Official documentation of the chosen frontend and backend frameworks, database, ORM and WebSocket library.
​

ft_transcendence subject PDF for requirements, modules, and README structure.
​

AI Usage
AI was used to help draft and structure this README based on the official ft_transcendence requirements.
​

AI may have been used to generate or refine ideas for architecture or code snippets, which were then reviewed and fully understood by team members before integration.
