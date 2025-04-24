// API route to proxy requests to the external inventory API
import { NextResponse } from 'next/server';

// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    console.log('API route called - attempting to fetch inventory data...');
    
    // External API URL
    const API_URL = 'https://dev.electorq.com/dummy/inventory';
    console.log('Fetching from:', API_URL);
    
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
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    // Parse the response to JSON with a timeout as well
    const responseJson = await Promise.race([
      response.json(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('JSON parsing timed out')), 3000))
    ]);
    
    // Validate data structure
    const data = Array.isArray(responseJson) ? responseJson : [];
    if (!Array.isArray(responseJson)) {
      console.warn('API did not return an array, using empty array instead');
    }
    console.log('Data fetched successfully:', data ? `${data.length} items` : 'No data');
    
    // Mock data for testing if API fails - uncomment for testing
    /*
    const mockData = [
      {
        component_id: 'BAT01',
        component_name: 'Battery Pack',
        subcomponents: [
          {
            component_id: 'BATCELL01',
            component_name: 'Battery Cell',
            usable_quantity: 120,
            damaged_quantity: 2,
            discarded_quantity: 1,
            total_quantity: 123
          }
        ]
      }
    ];
    */
    
    // Return the data with explicit headers to ensure no caching
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
