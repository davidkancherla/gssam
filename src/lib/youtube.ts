export function extractYoutubeId(value: string) {
  const input = value.trim();
  if (!input) return "";

  const patterns = [
    /(?:youtube\.com|youtube-nocookie\.com)\/embed\/([\w-]{11})/,
    /(?:youtube\.com|youtube-nocookie\.com)\/shorts\/([\w-]{11})/,
    /(?:youtube\.com|youtube-nocookie\.com)\/live\/([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }

  if (/^[\w-]{11}$/.test(input)) return input;
  return input;
}

export function youtubeEmbedUrl(value: string) {
  return `https://www.youtube.com/embed/${extractYoutubeId(value)}`;
}

export function youtubeWatchUrl(value: string) {
  return `https://www.youtube.com/watch?v=${extractYoutubeId(value)}`;
}

export function youtubeThumbUrl(value: string) {
  return `https://i.ytimg.com/vi/${extractYoutubeId(value)}/hqdefault.jpg`;
}
