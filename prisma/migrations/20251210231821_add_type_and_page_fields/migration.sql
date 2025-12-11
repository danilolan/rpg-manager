-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('REGULAR', 'SPECIAL');

-- AlterTable
ALTER TABLE "resource_qualities_drawbacks" ADD COLUMN     "page" INTEGER;

-- AlterTable
ALTER TABLE "resource_skills" ADD COLUMN     "page" INTEGER,
ADD COLUMN     "type" "SkillType" NOT NULL DEFAULT 'REGULAR';
