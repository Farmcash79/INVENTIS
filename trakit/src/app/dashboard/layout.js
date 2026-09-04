// This used to be a full copy-paste of the dashboard page's own UI, and it
// never rendered {children} — which meant src/app/dashboard/page.js was
// dead code that could never actually appear on screen. A layout's job is
// just to wrap the page (the Sidebar/shell is already provided by the root
// layout), so this is intentionally minimal.
export default function DashboardLayout({ children }) {
  return children;
}
