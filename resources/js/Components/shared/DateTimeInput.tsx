import {useMemo} from 'react';
import {cn} from '@/lib/utils';

type DateTimeInputProps = {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
};

function toLocalDateTime(isoString: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

function fromLocalDateTime(local: string): string {
  if (!local) return '';
  return new Date(local).toISOString();
}

export function DateTimeInput({value, onChange, placeholder, className, readOnly}: DateTimeInputProps) {
  const localValue = useMemo(() => toLocalDateTime(value), [value]);

  return (
    <input
      type="datetime-local"
      value={localValue}
      onChange={onChange ? (e) => onChange(fromLocalDateTime(e.target.value)) : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
      className={cn(
        'w-full rounded-xl border border-[#e8ddd4] bg-white px-4 py-2.5 text-sm font-medium text-[#1a1612] placeholder-[#c4b9af] outline-none transition focus:border-[#c9974a] focus:ring-4 focus:ring-[#c9974a]/10',
        readOnly && 'bg-[#f5f0eb] text-[#9a9088] cursor-not-allowed',
        className
      )}
    />
  );
}
