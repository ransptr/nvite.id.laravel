export function getSlugFromPathname(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] ?? 'claire';
}

export async function resolveGuestName(search: string, queryParam: string) {
  const params = new URLSearchParams(search);
  const guestKey = params.get('to');
  if (guestKey) {
    try {
      const response = await fetch(`/api/guests/resolve?key=${encodeURIComponent(guestKey)}`);
      if (response.ok) {
        const data = await response.json();
        if (data?.name) return data.name;
      }
    } catch {
      // fallback to local parsing
    }
  }
  return getGuestNameFromSearch(search, queryParam);
}

export function getGuestNameFromSearch(search: string, queryParam: string) {
  const params = new URLSearchParams(search);
  const guestKey = params.get('to');
  if (guestKey) {
    const parts = guestKey.split('-');
    const baseParts = parts.length > 1 ? parts.slice(0, -1) : parts;
    const decoded = baseParts.join(' ').trim();
    if (decoded) {
      return decoded
        .split(' ')
        .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
        .join(' ');
    }
  }
  return params.get(queryParam) ?? 'Guest Name';
}

export function createQrValue(slug: string, guestName: string) {
  const safeName = guestName.trim().toLowerCase().replace(/\s+/g, '-');
  return safeName || 'guest';
}

export function getQrPreviewUrl(value: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(value)}`;
}
