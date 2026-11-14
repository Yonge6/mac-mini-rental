// Brand films, read from the landing markup so the cards stay the single source of truth.
// Used for VideoObject structured data (prerender-home.mjs) and the video sitemap (generate-seo.mjs).
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Length in seconds and the date each film went on the site. Add an entry when a film is added.
const filmMeta = {
  baton: [15, '2026-11-13'], rings: [15, '2026-11-13'], shovel: [15, '2026-11-13'], light: [15, '2026-11-13'],
  bet: [15, '2026-11-13'], knife: [15, '2026-11-13'], first: [15, '2026-11-13'], bolt: [24, '2026-11-13'],
  pillar: [24, '2026-11-13'], pier: [24, '2026-11-13'], camp: [24, '2026-11-13'], pad: [24, '2026-11-13'],
  road: [24, '2026-11-13'], tether: [24, '2026-11-13'], pivot: [24, '2026-11-13'],
};

const text = html => html.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

export function readFilms(language, siteUrl) {
  const source = readFileSync(path.join(root, 'src', language === 'en' ? 'source.en.html' : 'source.html'), 'utf8');
  const films = [...source.matchAll(/<figure class="wm-film[^"]*"[^>]*>[\s\S]*?<video[^>]*src="([^"]+)"[^>]*poster="\.\/([^"]+)"[\s\S]*?<figcaption><b>([\s\S]*?)<\/b><span>([\s\S]*?)<\/span><\/figcaption><\/figure>/g)]
    .map(([, src, poster, title, description]) => {
      const key = src.match(/wodemac-film-([a-z0-9-]+)\.mp4$/)?.[1];
      const meta = filmMeta[key];
      if (!meta) throw new Error(`Film "${key}" needs a length and date in scripts/films.mjs.`);
      return { key, contentUrl: src, thumbnailUrl: `${siteUrl}/${poster}`, name: text(title), description: text(description), seconds: meta[0], uploadDate: `${meta[1]}T12:00:00-08:00` };
    });
  if (films.length < 1) throw new Error('No brand films found in the landing markup.');
  return films;
}

export const isoDuration = seconds => `PT${seconds}S`;
