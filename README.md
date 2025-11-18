# RPG Manager

A modern RPG character management system built with Next.js, Prisma, and PostgreSQL.

## Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop
- Git

### Setup (First Time)

```bash
# 1. Clone and install
git clone <your-repo-url>
cd rpg-manager
npm install
```

**2. Create `.env` file in project root:**
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=rpg_manager
POSTGRES_PORT=5432
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rpg_manager?schema=public"
```

```bash
# 3. Start PostgreSQL database in Docker (auto-pulls image on first run)
npm run db:start

# Wait 5 seconds for database to be ready, then:

# 4. Generate Prisma Client (creates TypeScript types)
npm run prisma:generate

# 5. Push schema to database + seed with sample data
npm run db:seed

# 6. Start dev server
npm run dev
```

**Done!** Visit [http://localhost:3000](http://localhost:3000)

The database runs in Docker (isolated), the app runs locally (fast hot reload).

### Daily Development

```bash
npm run db:start  # Start database (if not running)
npm run dev       # Start Next.js
```

## Key Commands

```bash
# Development
npm run dev              # Start Next.js with hot reload
npm run prisma:studio    # Open database GUI (localhost:5555)

# Database
npm run db:start         # Start PostgreSQL
npm run db:stop          # Stop PostgreSQL
npm run db:seed          # Reset schema + add 5 sample characters
npm run prisma:seed      # Add sample characters (no reset)

# Prisma
npm run prisma:generate  # Regenerate types after schema changes
npm run prisma:push      # Push schema changes to DB
```

## Tech Stack

- **Frontend:** Next.js 16, React 19, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL 16
- **ORM:** Prisma
- **UI:** Radix UI, shadcn/ui

## Features

- Create and manage RPG characters
- Attributes: Strength, Intelligence, Dexterity, Perception, Constitution, Will Power
- Status: Life, Endurance, Speed, Max Load
- Skills, Qualities, and Drawbacks system
- Character categories: Player, NPC, Zombie, Monster, Ally
- RESTful API

## API Endpoints

```
GET    /api/characters        # List all
POST   /api/characters        # Create
GET    /api/characters/:id    # Get one
PATCH  /api/characters/:id    # Update
DELETE /api/characters/:id    # Delete
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/characters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hero",
    "category": "PLAYER",
    "attributes": {"strength": 10, "intelligence": 12, "dexterity": 8, "perception": 10, "constitution": 11, "willPower": 9},
    "status": {"life": 100, "endurance": 80, "speed": 15, "maxLoad": 50}
  }'
```

## Database Schema

```
Character (name, category, age, weight, height)
  ├── Attributes (1:1) → strength, intelligence, dexterity, perception, constitution, willPower
  ├── Status (1:1) → life, endurance, speed, maxLoad
  ├── Skills (1:N) → name, level, description
  ├── Qualities (1:N) → name, level, description
  └── Drawbacks (1:N) → name, level, description
```

## Project Structure

```
rpg-manager/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts         # Seed script (5 sample characters)
├── src/
│   ├── app/
│   │   ├── api/        # API routes
│   │   └── characters/ # Characters page
│   ├── components/
│   │   ├── organisms/  # Complex components
│   │   └── ui/         # shadcn/ui components
│   └── lib/
│       └── prisma.ts   # Prisma client singleton
├── docker-compose.yml   # PostgreSQL service
└── Dockerfile          # Production build
```

## Troubleshooting

**Port 3000 in use:**
```bash
netstat -ano | findstr :3000  # Find process
# Kill it or change APP_PORT in .env
```

**Database connection failed:**
```bash
docker ps                      # Check if DB is running
docker logs rpg-manager-db     # View logs
npm run db:stop && npm run db:start  # Restart
```

**Prisma client errors:**
```bash
npm run prisma:generate  # Regenerate client
```

## Production Deployment

### Docker
```bash
# Build
docker build --target production -t rpg-manager:latest .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NODE_ENV=production \
  rpg-manager:latest
```

### Full Stack in Docker (Local Testing)
```bash
npm run docker:dev:build  # Start app + DB in Docker
npm run docker:down       # Stop
```

Note: Use local dev for development (faster hot reload).

## License

MIT
