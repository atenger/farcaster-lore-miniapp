import { NextResponse } from 'next/server';
import castsIndex from '@/data/casts_index.json';

export async function GET() {
  return NextResponse.json(castsIndex, {
    headers: {
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'Content-Type': 'application/json',
    },
  });
} 