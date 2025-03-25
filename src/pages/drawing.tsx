import React from 'react';

interface DrawingPageProps {
    title: string;
    description: string;
    imageUrl: string;
    url: string;
}

export function DrawingPage({ title, description, imageUrl, url }: DrawingPageProps) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={description} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="image" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageUrl} />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={title} />
                <meta property="twitter:description" content={description} />
                <meta property="twitter:image" content={imageUrl} />
                
                <title>{title}</title>
                <style dangerouslySetInnerHTML={{ __html: `
                    body { margin: 0; padding: 20px; display: flex; justify-content: center; background: #f5f5f5; }
                    img { max-width: 100%; max-height: 90vh; object-fit: contain; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                `}} />
            </head>
            <body>
                <img src={url} alt={title} loading="eager" />
            </body>
        </html>
    );
} 