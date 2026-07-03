/**
 * Route-transition shell: remounts on every navigation, replaying a light
 * 240ms opacity fade (no layout motion, no LCP cost). Reduced-motion users
 * get an instant swap via the globals.css guard.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-fade">{children}</div>;
}
