/**
 * Proxy & Location Service
 * Handles address lookups and simulated proxy tunneling.
 */

// Using OpenStreetMap Nominatim for free address lookups
export const lookupAddress = async (query) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`);
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      const addr = result.address;
      
      return {
        country: addr.country || '',
        city: addr.city || addr.town || addr.village || addr.suburb || '',
        town: addr.neighbourhood || addr.suburb || '',
        zip: addr.postcode || '',
        lat: result.lat,
        lon: result.lon,
        display_name: result.display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Address lookup failed:', error);
    return null;
  }
};

export const getAddressSuggestions = async (query) => {
  try {
    // UNRESTRICTED: Added 'addressdetails=1' for street-level precision and 'namedetails=1'
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&namedetails=1`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch address suggestions:', error);
    return [];
  }
};

export const launchNativeBrowser = async (profileId, url, proxy, location, warmup = false) => {
  try {
    const response = await fetch('http://127.0.0.1:3001/launch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: url || 'https://www.google.com',
        proxy,
        profileId,
        location, // city, lat, lon, timezone
        warmup
      })
    });


    return await response.json();
  } catch (error) {
    console.error('Bridge launch failed:', error);
    return { success: false, error: 'Bridge offline or unreachable' };
  }
};

export const getBridgeStatus = async () => {
  try {
    const response = await fetch('http://127.0.0.1:3001/status');
    return await response.json();
  } catch (error) {
    return { status: 'offline' };
  }
};

export const closeNativeSession = async (profileId) => {
  try {
    const response = await fetch('http://127.0.0.1:3001/close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId })
    });
    return await response.json();
  } catch (error) {
    return { success: false };
  }
};

export const analyzeIdea = async (url) => {
  try {
    const response = await fetch('http://127.0.0.1:3001/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    return await response.json();
  } catch (error) {
    console.error('Idea analysis failed:', error);
    return { success: false, error: 'Bridge offline or analysis failed' };
  }
};

