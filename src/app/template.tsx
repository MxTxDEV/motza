/** Transição curta entre páginas — CSS puro (sem JS, sem atrasar o LCP). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
