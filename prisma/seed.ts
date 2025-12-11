import { PrismaClient, CharacterCategory, SkillType } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

const characterNames = [
  'Aria Shadowblade',
  'Marcus Ironheart',
  'Elena Moonwhisper',
  'Viktor Stormborn',
  'Selena Nightshade',
]

const categories: CharacterCategory[] = [
  'PLAYER',
  'PLAYER',
  'NPC',
  'ALLY',
  'MONSTER',
]

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing resource data
  await prisma.resourceQualityDrawback.deleteMany()
  await prisma.resourceSkill.deleteMany()
  console.log('🗑️  Cleared existing resource data')

  // Clear existing character data (optional - comment out if you want to keep existing data)
  await prisma.characterQualityDrawback.deleteMany()
  await prisma.characterSkill.deleteMany()
  await prisma.status.deleteMany()
  await prisma.attributes.deleteMany()
  await prisma.character.deleteMany()
  console.log('🗑️  Cleared existing character data')

  // Load resources from JSON file
  const resourcesPath = path.join(__dirname, 'data', 'resources.json')
  const resourcesData = JSON.parse(fs.readFileSync(resourcesPath, 'utf-8'))

  // Seed Skills
  console.log('📚 Seeding skills...')
  let skillsCount = 0
  for (const skill of resourcesData.resourceSkills) {
    // Map "TYPE" to "REGULAR" since our enum only has REGULAR and SPECIAL
    const skillType = skill.type === 'TYPE' ? 'REGULAR' : (skill.type as SkillType)
    
    await prisma.resourceSkill.create({
      data: {
        name: skill.name,
        description: skill.description || null,
        type: skillType,
        page: skill.page || null,
      },
    })
    skillsCount++
  }
  console.log(`✅ Created ${skillsCount} skills`)

  // Seed Qualities and Drawbacks
  console.log('📚 Seeding qualities and drawbacks...')
  let qualitiesDrawbacksCount = 0
  for (const item of resourcesData.resourceQualitiesDrawbacks) {
    await prisma.resourceQualityDrawback.create({
      data: {
        name: item.name,
        description: item.description || null,
        cost: item.cost,
        page: item.page || null,
      },
    })
    qualitiesDrawbacksCount++
  }
  console.log(`✅ Created ${qualitiesDrawbacksCount} qualities/drawbacks`)

  // Get some resource skills and qualities/drawbacks to assign to characters
  const allSkills = await prisma.resourceSkill.findMany({ take: 10 })
  const allQualitiesDrawbacks = await prisma.resourceQualityDrawback.findMany({ take: 10 })

  // Create 5 characters
  for (let i = 0; i < characterNames.length; i++) {
    const character = await prisma.character.create({
      data: {
        name: characterNames[i],
        category: categories[i],
        age: randomInt(18, 50),
        weight: randomInt(50, 100),
        height: randomInt(150, 200),
        attributes: {
          create: {
            strength: randomInt(5, 15),
            intelligence: randomInt(5, 15),
            dexterity: randomInt(5, 15),
            perception: randomInt(5, 15),
            constitution: randomInt(5, 15),
            willPower: randomInt(5, 15),
          },
        },
        status: {
          create: {
            life: randomInt(50, 150),
            endurance: randomInt(50, 150),
            speed: randomInt(5, 20),
            maxLoad: randomInt(30, 80),
          },
        },
        characterSkills: {
          create: allSkills.slice(0, 2).map(skill => ({
            resourceSkillId: skill.id,
            level: randomInt(1, 10),
          })),
        },
        characterQualitiesDrawbacks: {
          create: allQualitiesDrawbacks.slice(0, 2).map(item => ({
            resourceQualityDrawbackId: item.id,
            level: randomInt(1, 5),
          })),
        },
      },
      include: {
        attributes: true,
        status: true,
        characterSkills: {
          include: {
            resourceSkill: true,
          },
        },
        characterQualitiesDrawbacks: {
          include: {
            resourceQualityDrawback: true,
          },
        },
      },
    })

    console.log(`✅ Created character: ${character.name} (${character.category})`)
  }

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

