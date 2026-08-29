
export default function Card({ children, className = "", padded = true, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${
        padded ? "p-6" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
