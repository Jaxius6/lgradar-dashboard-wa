import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook endpoint is reachable',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    
    console.log('Webhook test received:', {
      body: body.substring(0, 200) + '...',
      headers: {
        'stripe-signature': headers['stripe-signature'],
        'content-type': headers['content-type'],
        'user-agent': headers['user-agent']
      }
    });
    
    return NextResponse.json({ 
      received: true,
      bodyLength: body.length,
      hasSignature: !!headers['stripe-signature']
    });
  } catch (error) {
    console.error('Webhook test error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}