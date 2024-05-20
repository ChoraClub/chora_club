import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const individualDelegate = searchParams.get('individualDelegate');
console.log('individualDelegate', individualDelegate);
    if (!individualDelegate) {
      return new Response('Missing individualDelegate query parameter', { status: 400 });
    }

    console.log('api', process.env.OP_AGORA_AUTH_KEY)
    const response = await fetch(
      `https://vote.optimism.io/api/v1/delegates/${individualDelegate}`,
      {
        // method: 'POST',
        headers: {
          'accept': 'application/json',
          'mode': 'no-cors',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${process.env.OP_AGORA_AUTH_KEY}`,
        },
      }
    );

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response('Failed to fetch data', { status: 500 });
  }
}