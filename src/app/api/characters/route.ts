import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/characters - List all characters
export async function GET() {
  try {
    const characters = await prisma.character.findMany({
      include: {
        attributes: true,
        status: true,
        skills: true,
        qualities: true,
        drawbacks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(characters)
  } catch (error) {
    console.error('Error fetching characters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    )
  }
}

// POST /api/characters - Create a new character
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, age, weight, height, attributes, status, skills, qualities, drawbacks } = body

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    const character = await prisma.character.create({
      data: {
        name,
        category,
        age,
        weight,
        height,
        attributes: attributes ? {
          create: attributes,
        } : undefined,
        status: status ? {
          create: status,
        } : undefined,
        skills: skills ? {
          create: skills,
        } : undefined,
        qualities: qualities ? {
          create: qualities,
        } : undefined,
        drawbacks: drawbacks ? {
          create: drawbacks,
        } : undefined,
      },
      include: {
        attributes: true,
        status: true,
        skills: true,
        qualities: true,
        drawbacks: true,
      },
    })

    return NextResponse.json(character, { status: 201 })
  } catch (error) {
    console.error('Error creating character:', error)
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    )
  }
}

