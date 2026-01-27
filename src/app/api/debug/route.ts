import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('DEBUG API CALLED');
  return NextResponse.json({ message: 'DEBUG API WORKING' });
}

export async function GET() {
  console.log('DEBUG API GET CALLED');
  return NextResponse.json({ message: 'DEBUG API GET WORKING' });
}
