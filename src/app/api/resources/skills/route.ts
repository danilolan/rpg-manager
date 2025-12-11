import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/resources/skills - List all skills
export async function GET() {
  try {
    const skills = await prisma.resourceSkill.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}

// POST /api/resources/skills - Create a new skill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, type, page } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const skill = await prisma.resourceSkill.create({
      data: {
        name,
        description: description || null,
        type: type || 'REGULAR',
        page: page ? parseInt(page) : null,
      },
    })

    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}

