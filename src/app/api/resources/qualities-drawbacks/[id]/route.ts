import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ id: string }>

// GET /api/resources/qualities-drawbacks/[id] - Get a single quality or drawback
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params
    const item = await prisma.resourceQualityDrawback.findUnique({
      where: { id },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Quality/Drawback not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching quality/drawback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quality/drawback' },
      { status: 500 }
    )
  }
}

// PUT /api/resources/qualities-drawbacks/[id] - Update a quality or drawback
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, cost, page } = body

    const item = await prisma.resourceQualityDrawback.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description: description || null }),
        ...(cost !== undefined && { cost: parseInt(cost) }),
        ...(page !== undefined && { page: page ? parseInt(page) : null }),
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating quality/drawback:', error)
    return NextResponse.json(
      { error: 'Failed to update quality/drawback' },
      { status: 500 }
    )
  }
}

// DELETE /api/resources/qualities-drawbacks/[id] - Delete a quality or drawback
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params
    await prisma.resourceQualityDrawback.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Quality/Drawback deleted successfully' })
  } catch (error) {
    console.error('Error deleting quality/drawback:', error)
    return NextResponse.json(
      { error: 'Failed to delete quality/drawback' },
      { status: 500 }
    )
  }
}

