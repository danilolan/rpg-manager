import { PrismaClient, CharacterCategory } from '@prisma/client'

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

  // Clear existing data (optional - comment out if you want to keep existing data)
  await prisma.drawback.deleteMany()
  await prisma.quality.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.status.deleteMany()
  await prisma.attributes.deleteMany()
  await prisma.character.deleteMany()
  console.log('🗑️  Cleared existing data')

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
        skills: {
          create: [
            {
              name: 'Swordsmanship',
              level: randomInt(1, 10),
              description: 'Mastery of bladed weapons',
            },
            {
              name: 'Stealth',
              level: randomInt(1, 10),
              description: 'Moving without being detected',
            },
          ],
        },
        qualities: {
          create: [
            {
              name: 'Quick Reflexes',
              level: randomInt(1, 5),
              description: 'React faster in combat situations',
            },
          ],
        },
        drawbacks: {
          create: [
            {
              name: 'Fear of Heights',
              level: randomInt(1, 3),
              description: 'Uncomfortable in high places',
            },
          ],
        },
      },
      include: {
        attributes: true,
        status: true,
        skills: true,
        qualities: true,
        drawbacks: true,
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

