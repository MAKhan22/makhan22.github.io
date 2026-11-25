import React from 'react';

interface IconProps {
  className?: string;
  /** `brand` uses official colors; `mono` follows current text color. */
  variant?: 'brand' | 'mono';
}

const SCHOLAR_PATH =
  'M5.242 13.769 0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z';

/** Official ORCID iD mark. */
export const OrcidIcon: React.FC<IconProps> = ({
  className = 'w-5 h-5',
  variant = 'brand',
}) => {
  const isMono = variant === 'mono';

  return (
    <svg
      viewBox="0 0 256 256"
      className={`${className} overflow-hidden rounded-full`}
      aria-hidden="true"
    >
      <path
        fill={isMono ? 'currentColor' : '#A6CE39'}
        d="M256 128c0 70.7-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0s128 57.3 128 128z"
      />
      <path
        className={isMono ? 'fill-white dark:fill-zinc-800' : undefined}
        fill={isMono ? undefined : '#fff'}
        d="M86.3 186.2H70.9V79.1h15.4v107.1z"
      />
      <path
        className={isMono ? 'fill-white dark:fill-zinc-800' : undefined}
        fill={isMono ? undefined : '#fff'}
        d="M108.9 79.1h41.6c39.6 0 57 28.3 57 53.6 0 27.5-21.5 53.6-56.8 53.6h-41.8V79.1zm15.4 93.3h24.5c34.9 0 42.9-26.5 42.9-39.7C191.7 111.2 178 93 148 93h-23.7v79.4z"
      />
    </svg>
  );
};

/** Google Scholar mortarboard + portrait mark. */
export const GoogleScholarIcon: React.FC<IconProps> = ({
  className = 'w-5 h-5',
  variant = 'brand',
}) => {
  if (variant === 'mono') {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={SCHOLAR_PATH} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} overflow-hidden rounded-full`}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="12" fill="#4285F4" />
      <g transform="translate(2.2 2) scale(0.82)" fill="#fff">
        <path d={SCHOLAR_PATH} />
      </g>
    </svg>
  );
};
