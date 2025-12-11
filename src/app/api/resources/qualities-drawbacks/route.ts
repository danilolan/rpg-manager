import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/resources/qualities-drawbacks - List all qualities and drawbacks
export async function GET() {
  try {
    const items = await prisma.resourceQualityDrawback.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching qualities and drawbacks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch qualities and drawbacks' },
      { status: 500 }
    )
  }
}

// POST /api/resources/qualities-drawbacks - Create a new quality or drawback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, cost, page } = body

    // Validate required fields
    if (!name || cost === undefined) {
      return NextResponse.json(
        { error: 'Name and cost are required' },
        { status: 400 }
      )
    }

    const item = await prisma.resourceQualityDrawback.create({
      data: {
        name,
        description: description || null,
        cost: parseInt(cost),
        page: page ? parseInt(page) : null,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating quality/drawback:', error)
    return NextResponse.json(
      { error: 'Failed to create quality/drawback' },
      { status: 500 }
    )
  }
}

