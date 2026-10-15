import React from 'react';

interface IconProps {
  className?: string;
}

/** Official ORCID iD mark: green disc, white iD. */
export const OrcidIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 256 256"
    className={`${className} overflow-hidden rounded-full`}
    aria-hidden="true"
  >
    <path
      fill="#A6CE39"
      d="M256 128c0 70.7-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0s128 57.3 128 128z"
    />
    <path fill="#fff" d="M86.3 186.2H70.9V79.1h15.4v107.1z" />
    <path
      fill="#fff"
      d="M108.9 79.1h41.6c39.6 0 57 28.3 57 53.6 0 27.5-21.5 53.6-56.8 53.6h-41.8V79.1zm15.4 93.3h24.5c34.9 0 42.9-26.5 42.9-39.7C191.7 111.2 178 93 148 93h-23.7v79.4z"
    />
  </svg>
);

/** Google Scholar mark: blue disc, white mortarboard + head. */
export const GoogleScholarIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} overflow-hidden rounded-full`}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="12" fill="#4285F4" />
    <path
      fill="#fff"
      d="M12 4.2 20.2 10h-2.4v5.8h-2.8v-3.7H9v3.7H6.2V10H3.8L12 4.2zm0 7.6a2.55 2.55 0 1 1 0 5.1 2.55 2.55 0 0 1 0-5.1z"
    />
  </svg>
);
