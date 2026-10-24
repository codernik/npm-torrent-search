import TorrentSearchApi from 'torrent-search-api';

// Enable public providers (no login needed)
TorrentSearchApi.enablePublicProviders();

export async function GET(request) {
    const query = request.nextUrl.searchParams.get('query');
    if (!query) return Response.json([]);
    try {
        return Response.json(await TorrentSearchApi.search(query, 'All', 20));
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}
