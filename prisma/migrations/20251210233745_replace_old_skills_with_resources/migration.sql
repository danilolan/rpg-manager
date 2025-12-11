/*
  Warnings:

  - You are about to drop the `drawbacks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `qualities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skills` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "drawbacks" DROP CONSTRAINT "drawbacks_characterId_fkey";

-- DropForeignKey
ALTER TABLE "qualities" DROP CONSTRAINT "qualities_characterId_fkey";

-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_characterId_fkey";

-- DropTable
DROP TABLE "drawbacks";

-- DropTable
DROP TABLE "qualities";

-- DropTable
DROP TABLE "skills";

-- CreateTable
CREATE TABLE "character_skills" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "resourceSkillId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "character_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_qualities_drawbacks" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "resourceQualityDrawbackId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "character_qualities_drawbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "character_skills_characterId_resourceSkillId_key" ON "character_skills"("characterId", "resourceSkillId");

-- CreateIndex
CREATE UNIQUE INDEX "character_qualities_drawbacks_characterId_resourceQualityDr_key" ON "character_qualities_drawbacks"("characterId", "resourceQualityDrawbackId");

-- AddForeignKey
ALTER TABLE "character_skills" ADD CONSTRAINT "character_skills_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_skills" ADD CONSTRAINT "character_skills_resourceSkillId_fkey" FOREIGN KEY ("resourceSkillId") REFERENCES "resource_skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_qualities_drawbacks" ADD CONSTRAINT "character_qualities_drawbacks_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_qualities_drawbacks" ADD CONSTRAINT "character_qualities_drawbacks_resourceQualityDrawbackId_fkey" FOREIGN KEY ("resourceQualityDrawbackId") REFERENCES "resource_qualities_drawbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
