'use client'
import { generateRandomString, sha256, base64encode } from '@/utils/auth/tools'
import { useEffect, useContext } from 'react'
import { AuthContext } from '@/providers/auth-provider'

async function getToken(code: any) {
  // stored in the previous step
  const codeVerifier = localStorage.getItem('code_verifier');
  if (!codeVerifier) throw new Error("Code verifier not found in localStorage");

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI

    if (!clientId || !redirectUri) {
        throw new Error("Spotify client ID or redirect URI is not defined");
    }

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  }

  const body = await fetch(url, payload);
  const response = await body.json();
  const user_access_token = response.access_token;

  localStorage.setItem('access_token', user_access_token);
  return user_access_token
}


export default function LoginButton() {
  const { setAccessToken } = useContext(AuthContext);

  const authorize = async () => {
    const codeVerifier  = generateRandomString(64);
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI

    if (!clientId || !redirectUri) {
        throw new Error("Spotify client ID or redirect URI is not defined");
    }

    const scope = 'user-read-private user-read-email playlist-modify-private playlist-modify-public';
    const authUrl = new URL("https://accounts.spotify.com/authorize") 

    window.localStorage.setItem('code_verifier', codeVerifier);

    const params =  {
      response_type: 'code',
      client_id: clientId,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    }

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  }

    useEffect(() => {
      const run = async () => {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get("code");
          
          if (code) {
            const user_access_token = await getToken(code);
            setAccessToken(user_access_token)
          }

          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          console.error("Error during token exchange:", err);
        }
      };

      run();
    }, []);

    return <button onClick={authorize}>Login with Spotify</button>;
}

