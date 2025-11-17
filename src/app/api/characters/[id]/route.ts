import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ id: string }>

// GET /api/characters/[id] - Get a single character
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params

    const character = await prisma.character.findUnique({
      where: { id },
      include: {
        attributes: true,
        status: true,
        skills: true,
        qualities: true,
        drawbacks: true,
      },
    })

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(character)
  } catch (error) {
    console.error('Error fetching character:', error)
    return NextResponse.json(
      { error: 'Failed to fetch character' },
      { status: 500 }
    )
  }
}

// PATCH /api/characters/[id] - Update a character
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, category, age, weight, height, attributes, status } = body

    const character = await prisma.character.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(age !== undefined && { age }),
        ...(weight !== undefined && { weight }),
        ...(height !== undefined && { height }),
        ...(attributes && {
          attributes: {
            upsert: {
              create: attributes,
              update: attributes,
            },
          },
        }),
        ...(status && {
          status: {
            upsert: {
              create: status,
              update: status,
            },
          },
        }),
      },
      include: {
        attributes: true,
        status: true,
        skills: true,
        qualities: true,
        drawbacks: true,
      },
    })

    return NextResponse.json(character)
  } catch (error) {
    console.error('Error updating character:', error)
    return NextResponse.json(
      { error: 'Failed to update character' },
      { status: 500 }
    )
  }
}

// DELETE /api/characters/[id] - Delete a character
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params

    await prisma.character.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting character:', error)
    return NextResponse.json(
      { error: 'Failed to delete character' },
      { status: 500 }
    )
  }
}

