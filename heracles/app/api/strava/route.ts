import { NextResponse } from 'next/server';
import axios from 'axios';

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/strava/callback`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post('https://www.strava.com/oauth/token', {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code'
    });

    const { access_token, refresh_token, expires_at } = tokenResponse.data;

    // Store the tokens securely (this is a simplified example, consider using a database or encrypted cookies in production)
    const response = NextResponse.json({ success: true });
    response.cookies.set('strava_access_token', access_token, { httpOnly: true, secure: true });
    response.cookies.set('strava_refresh_token', refresh_token, { httpOnly: true, secure: true });
    response.cookies.set('strava_token_expiry', expires_at.toString(), { httpOnly: true, secure: true });

    // Redirect to the main page after successful authorization
    response.headers.set('Location', '/');
    return response;
  } catch (error) {
    console.error('Error in Strava OAuth:', error);
    return NextResponse.json({ error: 'Failed to authenticate with Strava' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'fetch_activities') {
    const accessToken = request.cookies.get('strava_access_token')?.value;
    const tokenExpiry = request.cookies.get('strava_token_expiry')?.value;

    if (!accessToken || !tokenExpiry) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    if (Date.now() / 1000 > parseInt(tokenExpiry)) {
      // Token has expired, refresh it
      const refreshToken = request.cookies.get('strava_refresh_token')?.value;
      if (!refreshToken) {
        return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
      }

      try {
        const refreshResponse = await axios.post('https://www.strava.com/oauth/token', {
          client_id: STRAVA_CLIENT_ID,
          client_secret: STRAVA_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        });

        const { access_token, refresh_token, expires_at } = refreshResponse.data;

        // Update stored tokens
        const response = NextResponse.json({ success: true });
        response.cookies.set('strava_access_token', access_token, { httpOnly: true, secure: true });
        response.cookies.set('strava_refresh_token', refresh_token, { httpOnly: true, secure: true });
        response.cookies.set('strava_token_expiry', expires_at.toString(), { httpOnly: true, secure: true });

        // Use the new access token
        const activitiesResponse = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
          headers: { 'Authorization': `Bearer ${access_token}` }
        });

        return NextResponse.json(activitiesResponse.data);
      } catch (error) {
        console.error('Error refreshing token:', error);
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
      }
    }

    try {
      const activitiesResponse = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      return NextResponse.json(activitiesResponse.data);
    } catch (error) {
      console.error('Error fetching Strava activities:', error);
      return NextResponse.json({ error: 'Failed to fetch Strava activities' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}