

export default function PermissionGate({ role, allow = [], children, fallback = null }) {
  if (!allow.includes(role)) return fallback;
  return <>{children}</>;
}
