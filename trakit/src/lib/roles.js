// Client-safe role helpers.
// IMPORTANT: this file must never import server-only packages (jsonwebtoken, bcryptjs, etc.)
// because it is imported directly by client components such as ProtectedRoute.
// Mixing server-only code into a client-imported module breaks the browser bundle.

export const normalizeRole = (role) => {
  if (!role) {
    return null;
  }

  const normalized = String(role).trim().toLowerCase();

  if (['sales', 'sales_rep', 'sales-rep', 'sales rep'].includes(normalized)) {
    return 'sales_rep';
  }

  if (normalized === 'owner') {
    return 'owner';
  }

  return null;
};
