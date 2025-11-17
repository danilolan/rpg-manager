# RPG Manager

A modern RPG character management system built with Next.js, Prisma, and PostgreSQL.

## Features

- ✅ Create and manage RPG characters
- ✅ Character attributes system (Strength, Intelligence, Dexterity, etc.)
- ✅ Status tracking (Life, Endurance, Speed, Max Load)
- ✅ Skills, Qualities, and Drawbacks system
- ✅ Multiple character categories (Player, NPC, Zombie, Monster, Ally)
- ✅ RESTful API
- ✅ Docker support for easy deployment
- ✅ Database seeding with sample data

## Tech Stack

- **Frontend:** Next.js 16, React 19, TailwindCSS
- **Backend:** Next.js API Routes (Server-Side)
- **Database:** PostgreSQL 16
- **ORM:** Prisma
- **UI Components:** Radix UI, shadcn/ui
- **Container:** Docker & Docker Compose

## Quick Start

### 1. Prerequisites

- Node.js 20+
- Docker Desktop
- Git

### 2. Clone and Install

```bash
git clone <your-repo-url>
cd rpg-manager
npm install
```

### 3. Setup Database

```bash
# Start PostgreSQL in Docker
npm run db:start

# Setup database schema and seed with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Available Scripts

### Development
```bash
npm run dev              # Start Next.js dev server with hot reload
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database
```bash
npm run db:start         # Start PostgreSQL in Docker (background)
npm run db:stop          # Stop PostgreSQL
npm run db:reset         # Reset database (delete all data)
npm run db:seed          # Push schema + seed with 5 sample characters
npm run db:setup         # Complete setup (start + push + seed)
```

### Prisma
```bash
npm run prisma:generate  # Generate Prisma Client types
npm run prisma:push      # Push schema to database
npm run prisma:migrate   # Create and run migrations
npm run prisma:studio    # Open Prisma Studio (DB GUI at localhost:5555)
npm run prisma:seed      # Seed database with sample characters
```

### Docker (Full Stack)
```bash
npm run docker:dev       # Start app + database in Docker
npm run docker:dev:build # Build and start in Docker
npm run docker:down      # Stop all services
npm run docker:reset     # Reset everything (remove volumes + rebuild)
```

## Database Schema

### Character
- Basic info: name, category, age, weight, height
- One-to-one: Attributes, Status
- One-to-many: Skills, Qualities, Drawbacks

### Attributes
- Strength, Intelligence, Dexterity
- Perception, Constitution, Will Power

### Status
- Life, Endurance, Speed, Max Load

### Skills / Qualities / Drawbacks
- Name, Level, Description

## API Endpoints

### Characters

```
GET    /api/characters        # List all characters
POST   /api/characters        # Create a character
GET    /api/characters/:id    # Get single character
PATCH  /api/characters/:id    # Update character
DELETE /api/characters/:id    # Delete character
```

**Example: Create Character**
```bash
curl -X POST http://localhost:3000/api/characters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hero Name",
    "category": "PLAYER",
    "attributes": {
      "strength": 10,
      "intelligence": 12,
      "dexterity": 8,
      "perception": 10,
      "constitution": 11,
      "willPower": 9
    },
    "status": {
      "life": 100,
      "endurance": 80,
      "speed": 15,
      "maxLoad": 50
    }
  }'
```

## Project Structure

```
rpg-manager/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Database seed script
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── characters/    # Characters page
│   │   └── layout.tsx     # Root layout
│   ├── components/
│   │   ├── organisms/     # Complex components
│   │   └── ui/           # shadcn/ui components
│   └── lib/
│       └── prisma.ts      # Prisma client singleton
├── docker-compose.yml      # Docker services config
├── Dockerfile             # Multi-stage build
└── package.json           # Dependencies & scripts
```

## Development Workflow

### Recommended: Local Dev with Hot Reload

1. Start database in Docker:
```bash
npm run db:start
```

2. Run Next.js locally:
```bash
npm run dev
```

This gives you:
- ✅ Instant hot reload
- ✅ Fast development cycle
- ✅ Isolated database
- ✅ Easy debugging

### Alternative: Full Docker Stack

```bash
npm run docker:dev:build
```

Note: Hot reload is slower in Docker.

## Database Seeding

The seed script creates 5 sample characters:

1. **Aria Shadowblade** (PLAYER) - Agile rogue
2. **Marcus Ironheart** (PLAYER) - Strong warrior
3. **Elena Moonwhisper** (NPC) - Mysterious mage
4. **Viktor Stormborn** (ALLY) - Powerful ally
5. **Selena Nightshade** (MONSTER) - Dangerous foe

Each character includes random stats, 2 skills, 1 quality, and 1 drawback.

Run the seed:
```bash
npm run prisma:seed
```

## Deployment

### Docker Production Build

```bash
docker build --target production -t rpg-manager:latest .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NODE_ENV=production \
  rpg-manager:latest
```

### CI/CD Ready

The Docker setup is ready for:
- GitHub Actions
- GitLab CI
- Jenkins
- Any container orchestration platform

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Change port in .env or stop the process
```

### Database Connection Issues
```bash
# Check if DB is running
docker ps

# View logs
docker logs rpg-manager-db

# Restart database
npm run db:stop
npm run db:start
```

### Prisma Client Not Generated
```bash
npm run prisma:generate
```

## Documentation

- [Docker Setup Guide](./DOCKER_SETUP.md) - Comprehensive Docker documentation
- [Prisma Schema](./prisma/schema.prisma) - Database schema definition

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint`
5. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
