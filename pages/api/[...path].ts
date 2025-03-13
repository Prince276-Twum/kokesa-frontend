// pages/api/[...path].ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get the backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    if (!backendUrl) {
      throw new Error('Backend URL is not set');
    }
    
    // Extract the path from the request
    const path = req.query.path as string[];
    const endpoint = path.join('/');
    
    // Construct the full URL to the backend
    const queryParams = new URLSearchParams();
    
    // Forward query parameters
    Object.entries(req.query)
      .filter(([key]) => key !== 'path')
      .forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v.toString()));
        } else if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const url = `${backendUrl}/api/${endpoint}${queryString}`;
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    // Forward relevant headers from the original request
    const headersToForward = [
      'authorization',
      'cookie',
      'x-csrftoken',
    ];
    
    headersToForward.forEach(headerName => {
      const headerValue = req.headers[headerName];
      if (headerValue) {
        headers[headerName] = Array.isArray(headerValue) 
          ? headerValue.join(', ') 
          : headerValue.toString();
      }
    });
    
    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
      credentials: 'include',
    };
    
    // Add body for non-GET/HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }
    
    // Make the request to the backend
    const response = await fetch(url, fetchOptions);

    
    // Forward response headers
    const headersToSend = [
      'set-cookie',
      'content-type',
      'authorization',
    ];
    
    headersToSend.forEach(headerName => {
      const headerValue = response.headers.get(headerName);
      if (headerValue) {
        res.setHeader(headerName, headerValue);
      }
    });
    
    // Set the status code
    res.status(response.status);
    
    // Handle response body
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return res.json(data);
    } else {
      const text = await response.text();
      return res.send(text);
    }
  } catch (error) {
    console.error('API Proxy Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch data from API',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}