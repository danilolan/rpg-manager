import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/youtube/[id] - Get a single YouTube video
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const video = await prisma.youtubeVideo.findUnique({
      where: { id },
    })

    if (!video) {
      return NextResponse.json(
        { error: 'YouTube video not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error fetching YouTube video:', error)
    return NextResponse.json(
      { error: 'Failed to fetch YouTube video' },
      { status: 500 }
    )
  }
}

// PUT /api/youtube/[id] - Update a YouTube video
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, category, youtubeLink } = body

    const video = await prisma.youtubeVideo.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(youtubeLink && { youtubeLink }),
      },
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error updating YouTube video:', error)
    return NextResponse.json(
      { error: 'Failed to update YouTube video' },
      { status: 500 }
    )
  }
}

// DELETE /api/youtube/[id] - Delete a YouTube video
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.youtubeVideo.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'YouTube video deleted successfully' })
  } catch (error) {
    console.error('Error deleting YouTube video:', error)
    return NextResponse.json(
      { error: 'Failed to delete YouTube video' },
      { status: 500 }
    )
  }
}

