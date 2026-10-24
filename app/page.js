'use client';

import { useEffect, useState } from 'react';

const SORTS = { seeds: 'Seeds', date: 'Date' };

// Open / copy the magnet link. Providers that only give a detail page get it fetched on first click.
function MagnetActions({ result }) {
    const [state, setState] = useState('idle');

    async function getMagnet() {
        if (result.magnet) return result.magnet;
        setState('loading');
        try {
            const res = await fetch('/api/magnet?' + new URLSearchParams({ provider: result.provider, desc: result.desc }));
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            result.magnet = data.magnet; // cache it so the next click is instant
            setState('idle');
            return data.magnet;
        } catch {
            setState('error');
        }
    }

    async function open() {
        const magnet = await getMagnet();
        if (magnet) window.location.href = magnet;
    }

    async function copy() {
        const magnet = await getMagnet();
        if (!magnet) return;
        try {
            await navigator.clipboard.writeText(magnet);
            setState('copied');
            setTimeout(() => setState('idle'), 2000);
        } catch {
            // Clipboard API is blocked on plain http and in some browsers after an await; let the user copy by hand
            window.prompt('Copy the magnet link:', magnet);
        }
    }

    if (state === 'error') {
        return (
            <a className="md-btn md-btn-tonal" href={result.desc} target="_blank" rel="noreferrer" title="Couldn't get the magnet link, open the torrent page instead">
                🔗 Details
            </a>
        );
    }
    return (
        <div className="actions">
            <button className="md-btn md-btn-filled" onClick={open} disabled={state === 'loading'}>
                {state === 'loading' ? 'Getting link…' : '🧲 Magnet'}
            </button>
            <button className="md-btn md-btn-outlined" onClick={copy} disabled={state === 'loading'}>
                {state === 'copied' ? '✓ Copied' : '📋 Copy'}
            </button>
        </div>
    );
}

export default function Home() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('seeds');

    // Debounce typing by 500ms and abort the previous in-flight request
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/search?query=' + encodeURIComponent(query), { signal: controller.signal });
                if (!res.ok) throw new Error();
                setResults(await res.json());
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError('Search failed. Please try again.');
                setResults([]);
            }
            setLoading(false);
        }, 500);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    const sortedResults = [...results].sort((a, b) =>
        sortBy === 'seeds' ? (b.seeds ?? 0) - (a.seeds ?? 0) : new Date(b.time) - new Date(a.time)
    );

    return (
        <>
            <header className="md-top-app-bar">
                <span className="md-top-app-bar-title">Torrent Search</span>
            </header>

            <main>
                <div className="md-text-field md-text-field-outlined">
                    <input id="search" type="search" placeholder=" " value={query} onChange={(e) => setQuery(e.target.value)} />
                    <label htmlFor="search">Search torrents</label>
                </div>

                <div className="chips" role="group" aria-label="Sort by">
                    {Object.entries(SORTS).map(([key, label]) => (
                        <button
                            key={key}
                            className={'md-chip md-chip-filter' + (sortBy === key ? ' md-chip-selected' : '')}
                            aria-pressed={sortBy === key}
                            onClick={() => setSortBy(key)}
                        >
                            Sort by {label}
                        </button>
                    ))}
                </div>

                {loading && (
                    <div className="md-progress-linear md-progress-linear-indeterminate" role="progressbar" aria-label="Searching">
                        <div className="md-progress-linear-track" />
                    </div>
                )}
                {error && <div className="status error">{error}</div>}
                {!loading && !error && results.length === 0 && query && <div className="status">No results found.</div>}

                {sortedResults.map((result, index) => (
                    <article className="md-card md-card-outlined result" key={index}>
                        <div className="result-body">
                            <span className="provider md-label-small">{result.provider}</span>
                            <h3 className="md-title-medium">
                                <a href={result.magnet || result.desc} target="_blank" rel="noreferrer">{result.title}</a>
                            </h3>
                            <div className="meta md-label-medium">
                                <span className="pill seeds">▲ {result.seeds ?? 'N/A'} seeds</span>
                                <span className="pill peers">▼ {result.peers ?? 'N/A'} peers</span>
                                {result.size && <span className="pill">💾 {result.size}</span>}
                                {result.time && <span className="pill">🕒 {result.time}</span>}
                            </div>
                        </div>
                        <div className="result-action">
                            {result.magnet || result.desc ? (
                                <MagnetActions result={result} key={result.desc || result.magnet} />
                            ) : (
                                <span className="status md-label-medium">No link available</span>
                            )}
                        </div>
                    </article>
                ))}
            </main>
        </>
    );
}
