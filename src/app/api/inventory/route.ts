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
    
    // Fetch data from the external API with explicit headers
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      // Explicitly disable caching to ensure fresh data
      next: { revalidate: 0 }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    // Parse the response to JSON
    const data = await response.json();
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
    
  } catch (error: any) {
    console.error('Error fetching inventory data:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Failed to fetch inventory data' }),
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
