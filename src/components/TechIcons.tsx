interface TechIconProps {
  id: string;
  className?: string;
  size?: number;
}

export function TechIcon({ id, className = 'w-4 h-4', size = 16 }: TechIconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    className: `inline-block shrink-0 ${className}`,
    'aria-hidden': true,
  };

  switch (id) {
    case 'react':
      return (
        <svg {...props} viewBox="-11.5 -10.23174 23 20.46348" fill="none">
          <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
          <g stroke="#61DAFB" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );

    case 'typescript':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect width="24" height="24" rx="4" fill="#3178C6" />
          <path
            fill="#FFFFFF"
            d="M3.75 8.75h7.5v2.25H8.625V19.5H6.375V11H3.75V8.75zm8.5 7.125c.625.5 1.5.875 2.5.875 1.375 0 2-.625 2-1.375 0-.75-.5-1.125-1.625-1.5l-.875-.375c-1.75-.625-2.625-1.625-2.625-3 0-1.75 1.375-3.125 3.625-3.125 1.25 0 2.25.375 2.875.75l-.625 2c-.5-.375-1.25-.625-2.25-.625-1 0-1.625.5-1.625 1.125 0 .625.5 1 1.5 1.375l.875.375c2 .75 2.875 1.75 2.875 3.25 0 1.875-1.375 3.25-4 3.25-1.375 0-2.625-.5-3.375-1l.75-2.025z"
          />
        </svg>
      );

    case 'javascript':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect width="24" height="24" rx="4" fill="#F7DF1E" />
          <path
            fill="#000000"
            d="M6.5 17.5c.75.5 1.75.875 2.75.875 1.75 0 2.75-.875 2.75-2.75V8.75H9.75v6.75c0 .75-.375 1.125-1.125 1.125-.5 0-.875-.125-1.25-.375l-.875 1.25zm6.5-.125c.875.625 2 1 3.25 1 2.25 0 3.75-1.125 3.75-3.25 0-1.875-1.125-2.75-2.75-3.5l-.875-.375c-1-.375-1.5-.75-1.5-1.375 0-.625.5-1.125 1.375-1.125.75 0 1.5.25 2 .625l.75-1.5c-.75-.5-1.625-.75-2.75-.75-2.125 0-3.5 1.25-3.5 3 0 1.75 1.125 2.625 2.75 3.375l.875.375c1 .5 1.625.875 1.625 1.625 0 .875-.75 1.375-1.875 1.375-.875 0-1.875-.375-2.5-.875l-.875 1.5z"
          />
        </svg>
      );

    case 'html':
    case 'html5':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path fill="#E34F26" d="M3 2l1.8 20.2L12 24l7.2-1.8L21 2H3z" />
          <path fill="#EF652A" d="M12 3.8v18.4l5.7-1.4 1.5-17H12z" />
          <path
            fill="#FFFFFF"
            d="M7 6.8h10l-.2 2.3H9.4l.2 2.5h7l-.5 5.5-4.1 1.1-4.1-1.1-.3-3.1h2.2l.1 1.6 2.1.6 2.1-.6.2-2.3H7.4l-.4-6z"
          />
        </svg>
      );

    case 'css':
    case 'css3':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path fill="#1572B6" d="M3 2l1.8 20.2L12 24l7.2-1.8L21 2H3z" />
          <path fill="#33A9DC" d="M12 3.8v18.4l5.7-1.4 1.5-17H12z" />
          <path
            fill="#FFFFFF"
            d="M7 6.8h10l-.2 2.3H9.4l.2 2.5h7l-.5 5.5-4.1 1.1-4.1-1.1-.3-3.1h2.2l.1 1.6 2.1.6 2.1-.6.2-2.3H7.4l-.4-6z"
          />
        </svg>
      );

    case 'python':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#3776AB"
            d="M11.9 2c-3.1 0-5 .6-5 2.6v2.1h5.2v.7H4.3c-2 0-3.3 1.3-3.3 3.6 0 2.2 1.3 3.6 3.3 3.6h1.7v-2.3c0-1.8 1.5-3.3 3.3-3.3h5.2c1.4 0 2.6-1.1 2.6-2.6V4.6c0-2-2-2.6-5.2-2.6zm-1.8 1.4c.5 0 .9.4.9.9 0 .5-.4.9-.9.9-.5 0-.9-.4-.9-.9 0-.5.4-.9.9-.9z"
          />
          <path
            fill="#FFD43B"
            d="M12.1 22c3.1 0 5-.6 5-2.6v-2.1h-5.2v-.7h7.8c2 0 3.3-1.3 3.3-3.6 0-2.2-1.3-3.6-3.3-3.6H18v2.3c0 1.8-1.5 3.3-3.3 3.3H9.5c-1.4 0-2.6 1.1-2.6 2.6v1.8c0 2 2 2.6 5.2 2.6zm1.8-1.4c-.5 0-.9-.4-.9-.9 0-.5.4-.9.9-.9.5 0 .9.4.9.9 0 .5-.4.9-.9.9z"
          />
        </svg>
      );

    case 'fastapi':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="11" fill="#009688" />
          <path fill="#FFFFFF" d="M12.8 3L5 13.5h5.5L9.6 21l8.9-11.2h-5.7z" />
        </svg>
      );

    case 'nodejs':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#5FA04E"
            d="M12 2.2l8.7 5v10l-8.7 5-8.7-5v-10L12 2.2zm0 2.3L5.3 8.7v7.4L12 19.9l6.7-3.8V8.7L12 4.5zm-1 3.5h2v6.5h-2V8zm0 8.5h2v2h-2v-2z"
          />
        </svg>
      );

    case 'express':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect width="24" height="24" rx="4" fill="#222" />
          <path
            fill="#FFFFFF"
            d="M5 8l2.5 4L5 16h2.2l1.4-2.4 1.4 2.4h2.2l-2.5-4 2.5-4H10l-1.4 2.4L7.2 8H5zm8.5 0c-2.2 0-3.5 1.6-3.5 4s1.3 4 3.5 4c1.8 0 3-1.1 3.4-2.6h-1.8c-.3.6-.8 1-1.6 1-1.1 0-1.7-.8-1.7-2.4h5.3v-.6c0-2-1.3-3.4-3.6-3.4zm0 1.6c1 0 1.6.6 1.6 1.4h-3.3c.1-.8.7-1.4 1.7-1.4z"
          />
        </svg>
      );

    case 'mongodb':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#47A248"
            d="M12 1.5C11.5 2 7 8 7 13.5c0 3.8 2.5 6.8 5 8.5 2.5-1.7 5-4.7 5-8.5C17 8 12.5 2 12 1.5zm.3 2.8c.1.2 3.2 4.8 3.2 9.2 0 2.8-1.5 5.2-3.2 6.5V4.3z"
          />
        </svg>
      );

    case 'postgresql':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#4169E1"
            d="M12 2C7 2 3.5 5.5 3.5 10c0 3.2 1.8 6 4.5 7.4v4.6l3.5-1.8V18c.2 0 .3.1.5.1 4.5 0 8.5-3.5 8.5-8.1C20.5 5.5 16.5 2 12 2zm-1 4.5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5z"
          />
        </svg>
      );

    case 'sql':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <ellipse cx="12" cy="6" rx="8" ry="3.2" fill="#E5A04B" />
          <path
            fill="#E5A04B"
            opacity="0.85"
            d="M4 6v5c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V6c0 1.8-3.6 3.2-8 3.2S4 7.8 4 6z"
          />
          <path
            fill="#E5A04B"
            opacity="0.7"
            d="M4 11v5c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2v-5c0 1.8-3.6 3.2-8 3.2S4 12.8 4 11z"
          />
        </svg>
      );

    case 'nosql':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect x="3" y="4" width="7" height="6" rx="1.5" fill="#47A248" />
          <rect x="14" y="4" width="7" height="6" rx="1.5" fill="#3178C6" />
          <rect x="8.5" y="14" width="7" height="6" rx="1.5" fill="#E5A04B" />
          <path
            d="M6.5 10v2.5h5.5v1.5M17.5 10v2.5H12"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      );

    case 'firebase-auth':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#FFCA28"
            d="M4.5 18.5L6.8 4.2c.1-.5.7-.7 1-.3l3.2 5.9-6.5 8.7z"
          />
          <path
            fill="#FFA000"
            d="M14.2 8.5l-3.2-5.9c-.3-.5-1-.4-1.2.2L4.5 18.5l9.7-10z"
          />
          <path
            fill="#F57C00"
            d="M12.5 12.8l2.2-2.3 4.8 8-7-5.7z"
          />
          <circle cx="16" cy="7" r="3.5" fill="#FFCA28" />
          <path d="M15.5 8.5h3v2h-1v1.5h-1v-1.5h-1v-2z" fill="#D98E3F" />
        </svg>
      );

    case 'firebase-storage':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#FFCA28"
            d="M4.5 18.5L6.8 4.2c.1-.5.7-.7 1-.3l3.2 5.9-6.5 8.7z"
          />
          <path
            fill="#FFA000"
            d="M14.2 8.5l-3.2-5.9c-.3-.5-1-.4-1.2.2L4.5 18.5l9.7-10z"
          />
          <path
            fill="#F57C00"
            d="M12.5 12.8l2.2-2.3 4.8 8-7-5.7z"
          />
          <rect x="13" y="13" width="8" height="6" rx="1.5" fill="#039BE5" />
          <circle cx="15.5" cy="16" r="0.75" fill="#FFFFFF" />
          <circle cx="18.5" cy="16" r="0.75" fill="#FFFFFF" />
        </svg>
      );

    case 'canvas':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect x="2.5" y="3.5" width="19" height="15" rx="2.5" fill="none" stroke="#E5A04B" strokeWidth="1.8" />
          <circle cx="7.5" cy="8.5" r="2" fill="#E5A04B" />
          <path d="M4 16l4.5-4 4 3.5 3-2.5 4.5 4" fill="none" stroke="#61DAFB" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M16 19.5l3.5 2.5" stroke="#E5A04B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'threejs':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2l9 16.5H3L12 2zm0 4.2L6.2 16.5h11.6L12 6.2z"
          />
          <circle cx="12" cy="11.5" r="2.2" fill="#E5A04B" />
        </svg>
      );

    case 'r3f':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M12 2.5L20 7v10l-8 4.5-8-4.5V7l8-4.5z" fill="none" stroke="#61DAFB" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill="#E5A04B" />
          <path d="M12 2.5v9.5m8-5l-8 5m-8-5l8 5" stroke="#61DAFB" strokeWidth="1" opacity="0.6" />
        </svg>
      );

    case 'game-2d':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect x="3" y="6" width="18" height="12" rx="4" fill="none" stroke="#E5A04B" strokeWidth="1.8" />
          <path d="M7 12h4M9 10v4" stroke="#E5A04B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="10.5" r="1.2" fill="#61DAFB" />
          <circle cx="18" cy="13.5" r="1.2" fill="#47A248" />
        </svg>
      );

    case 'experiences-3d':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M12 2l8 4.6v9.2L12 20.4l-8-4.6V6.6L12 2z" fill="none" stroke="#E5A04B" strokeWidth="1.8" />
          <path d="M12 2v9.2l8 4.6M12 11.2l-8 4.6" stroke="#E5A04B" strokeWidth="1.4" opacity="0.75" />
        </svg>
      );

    case 'linux':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#FCC624"
            d="M12 2C9.5 2 7.8 4.2 7.8 7.3c0 1.5.3 3.5.7 5.2-.6.7-1.5 1.7-1.5 3 0 2.5 2.1 4.5 5 4.5s5-2 5-4.5c0-1.3-.9-2.3-1.5-3 .4-1.7.7-3.7.7-5.2C16.2 4.2 14.5 2 12 2z"
          />
          <circle cx="10.5" cy="6.5" r="0.8" fill="#000" />
          <circle cx="13.5" cy="6.5" r="0.8" fill="#000" />
          <path d="M10.8 8.8c.7.4 1.7.4 2.4 0" stroke="#E34F26" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );

    case 'bash':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect x="2.5" y="4" width="19" height="16" rx="3" fill="#1E2731" stroke="#4A5560" strokeWidth="1.5" />
          <path d="M6.5 9l3.5 3-3.5 3" stroke="#4AF626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 15h5.5" stroke="#E5A04B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'git':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#F05032"
            d="M21.6 10.9L13.1 2.4c-.6-.6-1.5-.6-2.1 0L9.4 4l2.6 2.6c.6-.2 1.4 0 1.8.5.5.5.6 1.3.3 1.9l2.5 2.5c.6-.2 1.4 0 1.9.5.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.6-.6-.7-1.5-.3-2.2l-2.3-2.3v5.8c.2.2.4.5.4.9 0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5c0-.6.4-1.1.9-1.4V8.4c-.5-.3-.9-.8-.9-1.4 0-.8.7-1.5 1.5-1.5.3 0 .6.1.8.3L8 3.2 2.4 8.8c-.6.6-.6 1.5 0 2.1l8.5 8.5c.6.6 1.5.6 2.1 0l8.5-8.5h.1z"
          />
        </svg>
      );

    case 'github':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"
          />
        </svg>
      );

    case 'vercel':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path fill="#FFFFFF" d="M12 2L23 21H1L12 2z" />
        </svg>
      );

    case 'render':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#46E3B7"
            d="M12 2L3 7v10l9 5 9-5V7l-9-5zm-6.5 6.5L11 5.4v13.2L5.5 15.5V8.5zm13 7l-5.5 3.1V5.4l5.5 3.1v7z"
          />
        </svg>
      );

    case 'java':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#E76F00"
            d="M9 19.5c3.5.5 8-.2 8-2.2 0-1.5-2.5-2.2-5-2.3-3.5 0-6 1.2-6 2.5 0 1.5 2 2 3 2zm8.5-5c1.5.8 2.5 1.6 2.5 2.7 0 2.2-4 3.8-9 3.8s-8-1.5-8-3.5c0-.8.5-1.5 1.5-2.2.8.5 2 .9 3.5 1.1-2.5-1.3-1-3.5 1-4.5 1.5-.7 3.5-.8 4.5.5.8 1 1 2 4 2.1zM11 2.5c1 1.5 0 3-1.5 4.5 2-.5 4-2 3.5-4-.5-.8-1.5-.8-2-.5z"
          />
        </svg>
      );

    case 'cpp':
    case 'cplusplus':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#00599C"
            d="M12 2L2 7.8v11.4L12 22l10-5.8V7.8L12 2zm-1 14.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5c1.5 0 2.8.7 3.6 1.8l-1.6 1.2c-.5-.7-1.2-1.1-2-1.1-1.4 0-2.5 1.1-2.5 2.6s1.1 2.6 2.5 2.6c.8 0 1.6-.4 2-1.1l1.6 1.2c-.8 1.1-2.1 1.8-3.6 1.8zm6.5-3.5h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1zm3 0h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1z"
          />
        </svg>
      );

    case 'dart':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#0175C2"
            d="M4.1 3.5L3.5 4.1v5.3l6.5 6.5 5.3-5.3-11.2-7.1zm15.8 5.2l-3.5-3.5L9.3 2.1H4.1l15.8 15.8v-9.2zm-2.4 9.4L11.7 24h5.3l3.5-3.5-3-2.4z"
          />
          <path fill="#02569B" d="M9.3 2.1L4.1 7.3v5.3l11.2-11.2H9.3z" />
          <path fill="#29B6F6" d="M17.5 18.1L12.2 24h5.3l4.1-4.1-4.1-1.8z" />
        </svg>
      );

    case 'kotlin':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <defs>
            <linearGradient id="kotlinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7F52FF" />
              <stop offset="50%" stopColor="#C711E1" />
              <stop offset="100%" stopColor="#E4485D" />
            </linearGradient>
          </defs>
          <path fill="url(#kotlinGrad)" d="M22 22H2V2h20L12 12l10 10zM2 12l10-10H2v10z" />
        </svg>
      );

    case 'r':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#276DC3"
            d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c3.2 0 6.1-1.5 7.9-3.9l-3.5-2.2c-1.1 1.3-2.7 2.1-4.4 2.1-3.3 0-6-2.7-6-6s2.7-6 6-6c2.8 0 5.1 1.9 5.8 4.5h-4.3v3h7.9C21.8 7 17.4 2 12 2z"
          />
          <path
            fill="#165C9C"
            d="M14.5 9h-2v6h2c1.7 0 3-1.3 3-3s-1.3-3-3-3zm1 4.5h-1v-3h1c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5z"
          />
        </svg>
      );

    case 'rust':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="none" stroke="#DEA584" strokeWidth="1.8" />
          <path
            fill="#DEA584"
            d="M12 4a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm2 10.5l1.5 2.5h-1.8l-1.2-2.2H10v2.2H8.5V7h4.2c1.8 0 2.8 1 2.8 2.4a2.2 2.2 0 0 1-1.5 2.1zm-1.5-3.3c.7 0 1.3-.4 1.3-1.1s-.6-1.1-1.3-1.1H10v2.2h2.5z"
          />
        </svg>
      );

    case 'vscode':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#007ACC"
            d="M17.5 2.5L7.2 10.8 3.5 8 2 9.2l3 3-3 3 1.5 1.2 3.7-2.8 10.3 8.3L22 20.2V3.8L17.5 2.5zM17 17.5L9.5 12 17 6.5v11z"
          />
        </svg>
      );

    case 'ai-tools':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path
            fill="#E5A04B"
            d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2zm6 14l.9 3.1L22 20l-3.1.9L18 24l-.9-3.1L14 20l3.1-.9L18 16zm-12 0l.9 3.1L10 20l-3.1.9L6 24l-.9-3.1L2 20l3.1-.9L6 16z"
          />
        </svg>
      );

    default:
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
