import type { NextRequest } from 'next/server';

const {
  BITTE_API_KEY,
  BITTE_API_URL = 'https://ai-runtime-446257178793.europe-west1.run.app/chat',
} = process.env;

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export const POST = async (req: NextRequest): Promise<Response> => {
  try {
    const data = await req.json();

    const requestInit: RequestInit & { duplex: 'half' } = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BITTE_API_KEY}`,
      },
      duplex: 'half',
    };

    const upstreamResponse = await fetch(`${BITTE_API_URL}`, requestInit);

    const headers = new Headers(upstreamResponse.headers);
    headers.delete('Content-Encoding');
    
    // Add CORS headers
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers,
    });
  } catch (error) {
    console.error('Error in chat API route:', error);
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers,
    });
  }
};
