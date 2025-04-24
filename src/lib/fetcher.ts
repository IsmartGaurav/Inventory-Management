/**
 * universal fetcher function
 */
export const fetcher = async <T = unknown>(url: string): Promise<T> => {
    const response = await fetch(url)
  
    if (!response.ok) {
      // Throw an error with the HTTP status for better debugging
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
  
    return response.json()
  }
  