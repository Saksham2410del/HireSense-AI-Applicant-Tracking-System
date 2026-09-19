function Svg({ className, children }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function Sparkles({ className }) {
  return <Svg className={className}><path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z" /></Svg>;
}

export function ArrowRight({ className }) {
  return <Svg className={className}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
}

export function ArrowLeft({ className }) {
  return <Svg className={className}><path d="M19 12H5M11 18l-6-6 6-6" /></Svg>;
}

export function Plus({ className }) {
  return <Svg className={className}><path d="M12 5v14M5 12h14" /></Svg>;
}

export function Check({ className }) {
  return <Svg className={className}><path d="M20 6L9 17l-5-5" /></Svg>;
}

export function CheckCircle({ className }) {
  return <Svg className={className}><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></Svg>;
}

export function Briefcase({ className }) {
  return <Svg className={className}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></Svg>;
}

export function FileCheck({ className }) {
  return <Svg className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 15l2 2 4-4" /></Svg>;
}

export function Building({ className }) {
  return <Svg className={className}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M10 21v-4h4v4" /></Svg>;
}

export function MapPin({ className }) {
  return <Svg className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></Svg>;
}

export function Calendar({ className }) {
  return <Svg className={className}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></Svg>;
}

export function Clock({ className }) {
  return <Svg className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>;
}

export function Mail({ className }) {
  return <Svg className={className}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 6 10-6" /></Svg>;
}

export function Users({ className }) {
  return <Svg className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Svg>;
}

export function Grid({ className }) {
  return <Svg className={className}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></Svg>;
}

export function UploadCloud({ className }) {
  return <Svg className={className}><path d="M17 15a4 4 0 0 0-1-7.9 6 6 0 0 0-11.2 2A3.5 3.5 0 0 0 6 16h1" /><path d="M12 12v9M9 15l3-3 3 3" /></Svg>;
}

export function Spinner({ className }) {
  return <Svg className={className}><path d="M21 12a9 9 0 1 1-6.2-8.6" /></Svg>;
}
