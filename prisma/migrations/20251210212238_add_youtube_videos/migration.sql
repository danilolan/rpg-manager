-- CreateEnum
CREATE TYPE "CharacterCategory" AS ENUM ('PLAYER', 'ZOMBIE', 'NPC', 'MONSTER', 'ALLY');

-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "CharacterCategory" NOT NULL,
    "age" INTEGER,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attributes" (
    "id" TEXT NOT NULL,
    "strength" INTEGER NOT NULL DEFAULT 0,
    "intelligence" INTEGER NOT NULL DEFAULT 0,
    "dexterity" INTEGER NOT NULL DEFAULT 0,
    "perception" INTEGER NOT NULL DEFAULT 0,
    "constitution" INTEGER NOT NULL DEFAULT 0,
    "willPower" INTEGER NOT NULL DEFAULT 0,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status" (
    "id" TEXT NOT NULL,
    "life" INTEGER NOT NULL DEFAULT 0,
    "endurance" INTEGER NOT NULL DEFAULT 0,
    "speed" INTEGER NOT NULL DEFAULT 0,
    "maxLoad" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qualities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qualities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drawbacks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drawbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "random_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" DOUBLE PRECISION,
    "rarity" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "random_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roll_history" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roll_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "youtube_videos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "youtubeLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "youtube_videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attributes_characterId_key" ON "attributes"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "status_characterId_key" ON "status"("characterId");

-- AddForeignKey
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status" ADD CONSTRAINT "status_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualities" ADD CONSTRAINT "qualities_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drawbacks" ADD CONSTRAINT "drawbacks_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "random_items" ADD CONSTRAINT "random_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roll_history" ADD CONSTRAINT "roll_history_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roll_history" ADD CONSTRAINT "roll_history_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "random_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
