import TorrentSearchApi from 'torrent-search-api';

TorrentSearchApi.enablePublicProviders();

// Looks up the magnet link on a result's detail page, for providers that don't list it in search results
export async function GET(request) {
    const params = request.nextUrl.searchParams;
    const provider = TorrentSearchApi.getProvider(params.get('provider') || '', false);
    const desc = params.get('desc') || '';

    // Only fetch pages on the provider's own site, so this can't be used to request arbitrary URLs
    if (!provider || !URL.canParse(desc) || new URL(desc).origin !== new URL(provider.baseUrl).origin) {
        return Response.json({ error: 'Invalid provider or link' }, { status: 400 });
    }

    try {
        const magnet = await TorrentSearchApi.getMagnet({ provider: provider.name, desc });
        if (typeof magnet !== 'string' || !magnet.startsWith('magnet:')) throw new Error('No magnet link found');
        return Response.json({ magnet });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 502 });
    }
}
