import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;
    const filePath = join(process.cwd(), 'src', 'data', 'episodes', `episode_${videoId}.json`);
    const episodeData = JSON.parse(readFileSync(filePath, 'utf8'));

    return NextResponse.json(episodeData, {
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(`Error loading episode ${await params.then(p => p.videoId)}:`, error);
    return NextResponse.json(
      { error: 'Episode not found' },
      { status: 404 }
    );
  }
} 