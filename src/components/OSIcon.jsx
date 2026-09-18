export default function OSIcon({ os, ...props }) {
  switch (os) {
    case 'windows':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M3 5.5 10.4 4.5V11.3H3ZM11.3 4.4 21 3V11.2H11.3ZM3 12.3H10.4V19.1L3 18.1ZM11.3 12.3H21V21L11.3 19.6Z" />
        </svg>
      );
    case 'mac':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M17.05 12.5c-.03-2.4 1.96-3.55 2.05-3.6-1.12-1.64-2.86-1.86-3.48-1.89-1.48-.15-2.9.87-3.65.87-.76 0-1.92-.85-3.16-.83-1.63.03-3.13.95-3.97 2.4-1.69 2.94-.43 7.3 1.22 9.68.8 1.16 1.76 2.47 3.02 2.42 1.21-.05 1.67-.78 3.14-.78 1.46 0 1.87.78 3.16.76 1.31-.02 2.13-1.19 2.93-2.36.92-1.35 1.3-2.66 1.32-2.72-.03-.01-2.53-.97-2.58-3.85ZM14.7 5.35c.67-.81 1.12-1.94.99-3.07-.96.04-2.13.64-2.82 1.44-.62.71-1.17 1.87-1.02 2.97 1.08.08 2.18-.55 2.85-1.34Z" />
        </svg>
      );
    case 'linux':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
          <rect x="4" y="7" width="16" height="12" rx="2" />
          <path d="m8 11 3 2.5L8 16M13 16h3" />
        </svg>
      );
    default:
      return null;
  }
}
