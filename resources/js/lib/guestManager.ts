export function normalizeIdPhone(input: string) {
  const digits = input.replace(/[^\d+]/g, '').replace(/^\+/, '');
  const local = digits.replace(/^0/, '62').replace(/^8/, '628');
  if (!/^62\d{8,13}$/.test(local)) return null;
  return local;
}

export function generateGuestKey(name: string, normalizedPhone: string) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
    .replace(/^-|-$/g, '') || 'guest';
  const suffix = normalizedPhone.slice(-4);
  return `${base}-${suffix}`;
}

export function parseGuestCsv(text: string) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const [header, ...rows] = lines;
  const cols = header.split(',').map((h) => h.trim().toLowerCase());
  const nameIdx = cols.findIndex((c) => ['name', 'guest_name', 'guest'].includes(c));
  const phoneIdx = cols.findIndex((c) => ['phone', 'mobile', 'no_hp', 'whatsapp'].includes(c));
  if (nameIdx < 0 || phoneIdx < 0) throw new Error('CSV must contain name and phone columns.');
  return rows.map((row, idx) => {
    const parts = row.split(',');
    return {
      row: idx + 2,
      name: (parts[nameIdx] ?? '').trim(),
      phone: (parts[phoneIdx] ?? '').trim(),
    };
  });
}

export type ParsedGuestRow = {row: number; name: string; phone: string};

export function mapGuestRows(records: Record<string, unknown>[]) {
  const aliases = {
    name: ['name', 'guest_name', 'guest'],
    phone: ['phone', 'mobile', 'no_hp', 'whatsapp'],
  };
  const pick = (obj: Record<string, unknown>, keys: string[]) => {
    const found = Object.keys(obj).find((k) => keys.includes(k.trim().toLowerCase()));
    return found ? String(obj[found] ?? '') : '';
  };
  return records.map((r, idx) => ({
    row: idx + 2,
    name: pick(r, aliases.name).trim(),
    phone: pick(r, aliases.phone).trim(),
  }));
}
