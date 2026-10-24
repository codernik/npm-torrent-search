# npm-torrent-search

A small torrent search page. Type what you're looking for, and it pulls results from a handful of public torrent sites at once and shows them in one list, with seeds, peers, size and a magnet link.

I started this in 2020 as an Express + Vue experiment. It's now a Next.js app styled with [material-you-css](https://github.com/hiratazx/material-you-css), but the idea is the same: one search box, no ads, no popups.

## Running it

You need Node 20.9 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

For a production build:

```bash
npm run build
npm start
```

## How it works

There are only two pieces:

- `app/api/search/route.js` is the backend. It takes `?query=` and hands it to [torrent-search-api](https://github.com/JimmyLaurent/torrent-search-api), which scrapes the public providers and returns the top 20 results as JSON. You can hit it directly if you just want the data:

  ```
  GET /api/search?query=ubuntu
  ```

- `app/page.js` is the whole frontend. It waits until you stop typing for half a second before searching, and drops the previous request if you keep typing, so you don't get stale results flashing in. Results can be sorted by seeds or by date.

The theme follows your system's light/dark setting.

## Things to know

- Results depend entirely on which torrent sites are up and reachable from where you run this. Some days a provider is down or blocked by your ISP and you'll just get fewer results. That's not a bug in the app.
- Some providers (Limetorrents, TorrentProject) don't put the magnet link in their search results. For those, clicking "Magnet" fetches it from the torrent's page first, which takes a second or so. If that fails, the button turns into a "Details" link to the page.
- Sorting by date is rough, because providers report dates in different formats ("1 Year+", "Yesterday", real dates...).

## Done so far

- [x] Debounced search
- [x] Sort by seeders or date
- [x] Move to Next.js + Material You styling

## Disclaimer

This only searches publicly listed torrents. It doesn't host or download anything. What you do with the results is on you, so stick to stuff you're allowed to download.

## License

MIT, see [LICENSE](LICENSE).
