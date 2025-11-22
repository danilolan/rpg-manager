import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/randomizer/history - Get roll history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where = categoryId ? { categoryId } : {}

    const history = await prisma.rollHistory.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        item: {
          select: {
            id: true,
            name: true,
            description: true,
            weight: true,
            rarity: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error('Error fetching roll history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch roll history' },
      { status: 500 }
    )
  }
}

// POST /api/randomizer/history - Save a roll to history
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { categoryId, itemId } = body

    if (!categoryId || !itemId) {
      return NextResponse.json(
        { error: 'categoryId and itemId are required' },
        { status: 400 }
      )
    }

    const history = await prisma.rollHistory.create({
      data: {
        categoryId,
        itemId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        item: {
          select: {
            id: true,
            name: true,
            description: true,
            weight: true,
            rarity: true,
          },
        },
      },
    })

    return NextResponse.json(history, { status: 201 })
  } catch (error) {
    console.error('Error saving roll history:', error)
    return NextResponse.json(
      { error: 'Failed to save roll history' },
      { status: 500 }
    )
  }
}

// DELETE /api/randomizer/history - Delete all roll history
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')

    const where = categoryId ? { categoryId } : {}

    await prisma.rollHistory.deleteMany({
      where,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting roll history:', error)
    return NextResponse.json(
      { error: 'Failed to delete roll history' },
      { status: 500 }
    )
  }
}

