function Loader({ label = "Loading...", fullScreen = false, size = "md" }) {
  const sizes = { sm: "w-6 h-6 border-2", md: "w-10 h-10 border-4", lg: "w-16 h-16 border-4" };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-indigo-200 border-t-indigo-600 animate-spin`}
      />
      {label && <p className="text-gray-500 text-sm font-medium">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-100">
        {spinner}
      </div>
    );
  }

  return <div className="py-10 flex items-center justify-center w-full">{spinner}</div>;
}

export default Loader;
