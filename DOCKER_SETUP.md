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

## Local Development (Without Docker)

If you prefer to run the app locally without Docker:

### 1. Start PostgreSQL with Docker

```bash
# Start only the database
docker-compose up postgres -d
```

### 2. Setup Prisma

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

### 3. Run the Application

```bash
# Start Next.js dev server
npm run dev
```

## Available Scripts

### Docker Scripts
- `npm run docker:dev` - Start all services
- `npm run docker:dev:build` - Build and start all services
- `npm run docker:down` - Stop all services
- `npm run docker:reset` - Stop services, remove volumes, rebuild and start

### Prisma Scripts
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema to database (no migrations)
- `npm run prisma:migrate` - Create and run migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:seed` - Run database seeds

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
# With Docker (removes all data)
npm run docker:reset

# Locally
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

### Port Already in Use

```bash
# Check what's using port 3000 or 5432
# Windows PowerShell
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Kill the process or change APP_PORT/POSTGRES_PORT in .env
```

### Database Connection Issues

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

```bash
# Regenerate Prisma Client
docker exec -it rpg-manager-app npm run prisma:generate

# Or rebuild everything
npm run docker:reset
```

### Changes Not Reflecting

```bash
# Rebuild containers (Next.js should hot reload, but if not)
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

