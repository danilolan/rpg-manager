import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/randomizer/roll/[categoryId] - Get a random item from a category (weighted)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params

    // Get all items for the category
    const items = await prisma.randomItem.findMany({
      where: { categoryId },
    })

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'No items found in this category' },
        { status: 404 }
      )
    }

    // Random selection - todos os itens têm a mesma chance (peso é apenas físico do RPG)
    const randomIndex = Math.floor(Math.random() * items.length)
    const selectedItem = items[randomIndex]

    return NextResponse.json(selectedItem)
  } catch (error) {
    console.error('Error rolling random item:', error)
    return NextResponse.json(
      { error: 'Failed to roll random item' },
      { status: 500 }
    )
  }
}

