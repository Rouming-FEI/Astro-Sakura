import { siteConfig } from '../../config/site';

export async function GET() {
  const { apiKey, steamId } = siteConfig.steam;
  if (!apiKey || !steamId) {
    return new Response(JSON.stringify({ error: 'Steam not configured' }), { status: 500 });
  }
  try {
    const res = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`
    );
    const data = await res.json();
    const games = (data.response?.games ?? [])
      .sort((a: any, b: any) => b.playtime_forever - a.playtime_forever);
    return new Response(JSON.stringify({ games }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to fetch Steam data' }), { status: 500 });
  }
}
