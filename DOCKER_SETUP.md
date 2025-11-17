# RPG Manager - Docker Setup Guide

This guide covers local development and deployment setup using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed (Windows/Mac) or Docker + Docker Compose (Linux)
- Git
- Node.js 20+ (for local development without Docker)

## Architecture

The application consists of three services:

1. **postgres** - PostgreSQL 16 database
2. **prisma-migrate** - One-time migration service that runs Prisma migrations
3. **app** - Next.js application

## Quick Start (Docker)

### 1. Clone and Setup Environment

```bash
# Clone the repository
git clone <your-repo-url>
cd rpg-manager

# Create .env file from example
# Note: .env.example creation was blocked, so create it manually
```

Create a `.env` file in the root directory:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=rpg_manager
POSTGRES_PORT=5432

# Application Configuration
APP_PORT=3000
NODE_ENV=development

# Prisma Database URL (for local development outside Docker)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rpg_manager?schema=public"
```

### 2. Start the Application

```bash
# Start all services (first time - builds images)
npm run docker:dev:build

# Or for subsequent runs
npm run docker:dev

# The application will be available at:
# - App: http://localhost:3000
# - Database: localhost:5432
```

The startup sequence:
1. PostgreSQL starts and waits until healthy
2. Prisma migration service runs `prisma generate` and `prisma db push`
3. Next.js app starts once migrations are complete

### 3. Stop the Application

```bash
# Stop all services
npm run docker:down

# Stop and remove all data (reset database)
npm run docker:reset
```

## Database Seeding

The project includes a seed script that populates the database with 5 sample characters. Each character includes:
- Random attributes (strength, intelligence, dexterity, etc.)
- Status values (life, endurance, speed, max load)
- 2 skills (Swordsmanship, Stealth)
- 1 quality (Quick Reflexes)
- 1 drawback (Fear of Heights)

**Seed characters:**
1. Aria Shadowblade (PLAYER)
2. Marcus Ironheart (PLAYER)
3. Elena Moonwhisper (NPC)
4. Viktor Stormborn (ALLY)
5. Selena Nightshade (MONSTER)

## 🔥 Recommended: Local Development with Hot Reload

**Best for development!** Run only the database in Docker and Next.js locally for fast hot reload.

### Why This Approach?

- ✅ **Fast hot reload** - Changes reflect instantly
- ✅ **Better performance** - No Docker overhead for Next.js
- ✅ **Easy debugging** - Direct access to Node.js process
- ✅ **Same deployment** - Docker setup unchanged for production

### Setup

#### 1. Stop Full Docker Stack (if running)

```bash
npm run docker:down
```

#### 2. Create `.env` File

Create a `.env` file in the project root:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=rpg_manager
POSTGRES_PORT=5432

# Application Configuration
APP_PORT=3000
NODE_ENV=development

# Prisma Database URL (connects to Docker PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rpg_manager?schema=public"
```

#### 3. Start Only the Database

```bash
npm run db:start
```

This starts PostgreSQL in Docker and runs in the background (`-d` flag).

#### 4. Setup Prisma and Seed Database (First Time Only)

```bash
# Generate Prisma Client types
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed database with sample data
npm run prisma:seed
```

**Or use the all-in-one command:**
```bash
npm run db:seed
```

#### 5. Run Next.js Locally

```bash
npm run dev
```

🎉 **Done!** App runs at http://localhost:3000 with full hot reload.

### Daily Workflow

```bash
# Start database (if not running)
npm run db:start

# Start Next.js
npm run dev

# That's it! Make changes and see them instantly.
```

### Database Management Commands

```bash
# Start database
npm run db:start

# Stop database (keeps data)
npm run db:stop

# Reset database (deletes all data and restarts)
npm run db:reset

# Seed database with sample data
npm run prisma:seed

# Push schema + seed in one command
npm run db:seed

# Setup everything (start DB + push schema + seed)
npm run db:setup

# View database in Prisma Studio
npm run prisma:studio
```

## Alternative: Full Docker Stack (No Hot Reload)

If you prefer to run everything in Docker (note: hot reload is slower):

```bash
# Start all services
npm run docker:dev:build

# Stop all services
npm run docker:down
```

See the "Quick Start (Docker)" section at the top for full details.

## Available Scripts

### Database-Only Scripts (Recommended for Local Dev)
- `npm run db:start` - Start PostgreSQL in Docker (background)
- `npm run db:stop` - Stop PostgreSQL
- `npm run db:reset` - Reset database (delete all data and restart)
- `npm run db:seed` - Push schema and seed with sample data
- `npm run db:setup` - Complete setup (start + push + seed)

### Full Docker Scripts
- `npm run docker:dev` - Start all services (app + database)
- `npm run docker:dev:build` - Build and start all services
- `npm run docker:down` - Stop all services
- `npm run docker:reset` - Stop services, remove volumes, rebuild and start

### Prisma Scripts
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema to database (no migrations)
- `npm run prisma:migrate` - Create and run migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:seed` - Seed database with 5 sample characters

### Next.js Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Management

### Prisma Studio

Open a visual database editor:

```bash
# If running with Docker
docker exec -it rpg-manager-app npm run prisma:studio

# If running locally
npm run prisma:studio
```

Access at: http://localhost:5555

### Database Migrations

For production, use migrations instead of `db push`:

```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy
```

### Reset Database

```bash
# Database only (recommended for local dev)
npm run db:reset

# Full Docker stack (removes all data)
npm run docker:reset

# Or manually with Prisma
npx prisma migrate reset
```

## Project Structure

```
rpg-manager/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js app directory
│   ├── components/            # React components
│   ├── lib/
│   │   └── prisma.ts          # Prisma client singleton
│   └── types/                 # TypeScript types
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Multi-stage Docker build
├── .dockerignore              # Docker ignore patterns
├── .env                       # Environment variables (not in git)
└── package.json               # Dependencies and scripts
```

## Environment Variables

### Development
- Database automatically connects to `postgres` service in Docker
- DATABASE_URL is set in docker-compose.yml

### Production
Set these environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV=production`

## CI/CD Preparation

The current setup is ready for CI/CD with GitHub Actions. The Dockerfile includes:

- **Multi-stage build** (development and production targets)
- **Optimized layers** for faster builds
- **Prisma generation** in build stage
- **Security** (non-root user in production)

### Production Deployment

```bash
# Build production image
docker build --target production -t rpg-manager:latest .

# Run production container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-production-db-url" \
  -e NODE_ENV=production \
  rpg-manager:latest
```

## Troubleshooting

### Hot Reload Not Working in Docker

**Solution:** Use the recommended local development workflow (database-only in Docker):

```bash
# Stop full Docker stack
npm run docker:down

# Start only database
npm run db:start

# Run Next.js locally
npm run dev
```

This gives you instant hot reload while keeping the database isolated.

### Port Already in Use

```bash
# Check what's using port 3000 or 5432
# Windows PowerShell
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Kill the process or change APP_PORT/POSTGRES_PORT in .env
```

### Database Connection Issues

**For Local Dev (db:start):**
```bash
# Check if postgres is running
docker ps

# View logs
docker logs rpg-manager-db

# Restart database
npm run db:stop
npm run db:start
```

**For Full Docker Stack:**
```bash
# Check if postgres is healthy
docker-compose ps

# View logs
docker-compose logs postgres
docker-compose logs app

# Restart services
npm run docker:reset
```

### Prisma Client Not Generated

**For Local Dev:**
```bash
# Regenerate Prisma Client
npm run prisma:generate
```

**For Docker:**
```bash
# Regenerate in container
docker exec -it rpg-manager-app npm run prisma:generate

# Or rebuild everything
npm run docker:reset
```

### Changes Not Reflecting

**For Local Dev (Recommended):**
- Next.js hot reload should work automatically
- If not, restart: `Ctrl+C` and `npm run dev`

**For Docker:**
```bash
# Rebuild containers (hot reload is slower in Docker)
npm run docker:dev:build
```

## Next Steps

1. Configure GitHub Actions workflow for CI/CD
2. Set up production database (e.g., Railway, Supabase, Neon)
3. Add database seeding for initial data
4. Configure environment-specific settings
5. Set up monitoring and logging

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

