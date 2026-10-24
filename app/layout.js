import './globals.css';

export const metadata = {
    title: 'Torrent Search',
    description: 'Search your favorite torrents easily.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hiratazx/material-you-css@9fd26c2ccdd82e8933e5b298f11e402a56e21255/material-you.css" />
            </head>
            <body>{children}</body>
        </html>
    );
}
