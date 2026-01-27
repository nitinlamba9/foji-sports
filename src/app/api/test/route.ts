import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('Test API called - middleware fixed');
  
  try {
    const body = await request.json();
    console.log('Received body:', body);

    return NextResponse.json({
      message: 'Test API working',
      received: body
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ error: 'Test API error' });
  }
}
