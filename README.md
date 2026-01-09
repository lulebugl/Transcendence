*This project has been created as part of the 42 curriculum by hle-roi, jfranco, llebugle, maxweert, mwattier.

# ft_transcendence

A modern 3D Pong game built with real-time multiplayer, achievements, blockchain integration, and a responsive web interface.

---

## Description

**ft_transcendence** is a full-stack web application that reimagines Pong as a competitive, social, and technically advanced experience. Key features include:
- Real-time 3D Pong gameplay (Babylon.js)
- Multiplayer matchmaking and lobbies
- User authentication (JWT, 2FA)
- Achievements and player stats
- Blockchain match recording
- Friends, leaderboards, tournaments

---

## Instructions

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker 24+
- (Optional) .env configuration in `infra/.env`

### Setup & Run
```zsh
pnpm install
pnpm -r build
make build
make up
```
- Frontend: http://localhost:8080/
- Backend health: http://localhost:8080/api/health

### Endpoints
- API: `/api/*` (see docs/API_STRUCTURE.md)
- Auth: `/api/users/login`, `/api/users/register`, `/api/users/2fa`
- Matchmaking: `/api/matchmaking/*`
- Achievements: `/api/achievements`, `/api/users/:id/achievements`

---

## Resources
- [Notion Project Board](https://www.notion.so/lulebugl/Ft_transcendence-27b497c348318033bccdee1a5453f0de?source=copy_link)
- [Babylon.js Docs](https://doc.babylonjs.com/)
- [Fastify Docs](https://www.fastify.io/docs/latest/)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- [Ethers.js Docs](https://docs.ethers.org/)
- [JWT Auth](docs/AUTH_TOKEN.md)
- [API Structure](docs/API_STRUCTURE.md)

**AI Usage:**
- Used for code generation, refactoring, documentation, and UI prototyping. AI assisted in backend route scaffolding, frontend component generation, and README writing.

---

## Team Information
- **llebugle** (PO, Frontend Architect): Led frontend development, UI/UX, and overall project architecture.
- **hle-roi** (Tech Lead, API & Users): Created REST API, user management, authentication, and frontend-backend connectivity.
- **jfranco** (PM, Matchmaking): Built matchmaking, game session creation, and connection logic.
- **maxweert** (Developer, Blockchain): Developed blockchain integration for match recording (backend, smart contract).
- **mwattier** (Developer, Game Logic): Designed and implemented core Pong mechanics, backend game state, and real-time sync.

---

## Project Management
- **Organization:** Tasks distributed by feature/module, regular standups, async updates.
- **Tools:** Notion (planning), GitHub Issues (tracking), Discord and Whatsapp (communication).
- **Workflow:** Feature branches, code reviews, CI via Docker Compose.

---

## Technical Stack
- **Frontend:** React, Babylon.js, TailwindCSS, Radix UI, Vite
- **Backend:** Fastify, TypeScript, Drizzle ORM, SQLite, Ethers.js
- **Database:** SQLite (chosen for simplicity, speed, and Drizzle ORM compatibility)
- **Other:** Docker, JWT, 2FA, WebSockets, Blockchain (EVM-compatible)
- **Justification:** Modern, modular, scalable, and suited for real-time apps.

---

## Database Schema
- **Users:** id, username, avatar_url, password_hash, refresh_token, totp_secret_key, api_key
- **Games:** id, player1_id, player2_id, scores, winner_id, status, timestamps
- **UserStats:** id, user_id, level, games_played, games_won, streaks, xp
- **Friendships:** id, requester_id, receiver_id, status
- **Achievements:** id, name, description, rarity
- **UserAchievements:** id, user_id, achievement_id, unlocked_at

(Relationships: users <-> games, users <-> friendships, users <-> achievements)

---

## Features List
- **3D Pong Game:** mwattier
- **Matchmaking & Lobbies:** jfranco
- **Blockchain Match Recording:** maxweert
- **User Auth & 2FA:** hle-roi
- **Achievements & Stats:** hle-roi, llebugle
- **Friends & Leaderboards:** llebugle
- **Tournaments:** llebugle
- **Responsive UI:** llebugle

---

## Modules
- **Major:**
  - Use a framework for both the frontend and backend (2pts, everybody)
  - Implement real-time features using WebSockets or similar technology (2pts, jfranco)
  - A public API to interact with the database (2pts, maxweert)
  - Standard user management and authentication (2pts, hle-roi, llebugle)
  - Implement a complete web-based game where users can play against each other (2pts, jfranco, mwattier, llebugle)
  - Remote players (2pts, jfranco, mwattier, llebugle)
  - Implement advanced 3D graphics using a library like Three.js or Baby-lon.js (2pts, jfranco)
  - Store tournament(game score) scores on the Blockchain (2pts, maxweert)
- **Minor:**
  - Use an ORM for the database (1pt, everybody)
  - Custom-made design system with reusable components (1pt, llebugle)
  - Support for additional browsers (1pt, llebugle)
  - Game statistics and match history (1pt, llebugle)
  - Implement a complete 2FA (1pt, jfranco)
  - A gamification system to reward users for their actions (1pt, llebugle)

**Justification:** Each module chosen for pedagogical value, technical challenge, and user experience. Custom modules (blockchain, achievements) highlight innovation.

---

## Individual Contributions
- **mwattier:** Game physics, readme, testing and bugfixes
- **jfranco:** Matchmaking, session management, queue logic, WebSocket sync, backend state, testing and bugfixes
- **maxweert:** Smart contract, blockchain API, match recording, testing and bugfixes
- **hle-roi:** API routes, user CRUD, JWT/2FA, docs, testing and bugfixes
- **llebugle:** UI/UX, frontend architecture, achievements, testing and bugfixes

**Challenges:**
- Smooth game logic (mwattier)
- Blockchain integration and smart contract deployment (maxweert)
- Secure authentication and 2FA (hle-roi)
- Responsive UI and 3D rendering (llebugle)
- Matchmaking edge cases and real-time sync (jfranco)

---

## Usage & Limitations
- For local dev, use Docker Compose and provided Makefile.
- Known limitations: Blockchain module may be incomplete, some features in progress.


## Credits
- 42 School
- Babylon.js, Fastify, Drizzle ORM, Ethers.js
- All contributors

---

## Assets
- [Game Art Example](https://images.squarespace-cdn.com/content/62d66fa29e72c560f8efc020/1cd27e3d-e6bc-4bfe-99bd-fae5365f4ae2/NozomiCitadel_Zipline_Before%281%29.png?content-type=image%2Fpng)
