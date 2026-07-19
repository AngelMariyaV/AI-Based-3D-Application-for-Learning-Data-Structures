function Card({ children, className = "", hoverable = false, padded = true }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-slate-100
        ${padded ? "p-6" : ""}
        ${hoverable ? "hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer" : ""}
        ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
