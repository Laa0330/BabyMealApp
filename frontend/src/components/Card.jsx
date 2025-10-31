export default function Card({ title, children, actions }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      {title && <h2 className="text-xl font-semibold mb-3">{title}</h2>}
      {children}
      {actions && <div className="mt-4">{actions}</div>}
    </div>
  );
}
