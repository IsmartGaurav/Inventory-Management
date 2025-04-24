import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    // External API URL
    const API_URL = 'https://dev.electorq.com/dummy/inventory';
    // Create a timeout promise to avoid hanging API calls
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('API request timed out after 5 seconds')), 5000)
    );

    // Race the fetch against a timeout
    const fetchPromise = fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      // Explicitly disable caching to ensure fresh data
      next: { revalidate: 0 }
    });
    
    // Use Promise.race to implement a timeout
    const response = await Promise.race([fetchPromise, timeout]) as Response;

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const responseJson = await Promise.race([
      response.json(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('JSON parsing timed out')), 3000))
    ]);

    const data = Array.isArray(responseJson) ? responseJson : [];
    if (!Array.isArray(responseJson)) {
      console.warn('API did not return an array, using empty array instead');
    }
   
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      }
    });
    
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching inventory data:', errorMessage);
    return new NextResponse(
      JSON.stringify({ error: errorMessage || 'Failed to fetch inventory data' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET'
        }
      }
    );
  }
}
