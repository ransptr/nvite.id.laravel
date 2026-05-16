import {cn} from '@/lib/utils';

type MarqueeProps = {
  text?: string;
  bride?: string;
  groom?: string;
  splitBySpace?: boolean;
  className?: string;
  muted?: boolean;
};

export function Marquee({text, bride, groom, splitBySpace, className, muted = false}: MarqueeProps) {
  const getItems = () => {
    if (bride && (groom || splitBySpace)) {
      let first = bride.replace(/&/g, '');
      let second = groom;
      if (splitBySpace) {
        const parts = bride.split(/[\s&]+/).filter(Boolean);
        first = parts[0];
        second = parts[1] ?? '';
      }
      return Array.from({length: 8}, () => `\u00A0& ${first} & ${second}`);
    }
    if (text) {
      return Array.from({length: 8}, () => `${'\u00A0'}${text}`);
    }
    return [];
  };
  const items = getItems();

  return (
    <div className={cn('marquee-shell', className)}>
      <div className={cn('marquee-track pt-[20px] pb-[20px] md:pt-[30px] md:pb-[30px]', muted && 'opacity-35')}>
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
