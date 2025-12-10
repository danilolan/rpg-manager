import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/youtube - List all YouTube videos
export async function GET() {
  try {
    const videos = await prisma.youtubeVideo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch YouTube videos' },
      { status: 500 }
    )
  }
}

// POST /api/youtube - Create a new YouTube video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, youtubeLink } = body

    // Validate required fields
    if (!name || !category || !youtubeLink) {
      return NextResponse.json(
        { error: 'Name, category, and YouTube link are required' },
        { status: 400 }
      )
    }

    const video = await prisma.youtubeVideo.create({
      data: {
        name,
        category,
        youtubeLink,
      },
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Error creating YouTube video:', error)
    return NextResponse.json(
      { error: 'Failed to create YouTube video' },
      { status: 500 }
    )
  }
}

