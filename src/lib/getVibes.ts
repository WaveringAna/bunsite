import fs from 'fs';
import path from 'path';

export function getVibes() {
  const vibesDir = path.join(process.cwd(), 'src', 'public', 'vibes');
  
  try {
    const files = fs.readdirSync(vibesDir);
    
    // Get URLs for all files (no sorting)
    const vibeUrls = files.map(file => `/public/vibes/${file}`);
    
    return vibeUrls;
  } catch (error) {
    console.error('Error reading vibes directory:', error);
    return [];
  }
}
