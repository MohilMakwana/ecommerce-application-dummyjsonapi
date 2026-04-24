export default function PageWrapper({ children, className = '' }) {
  return (
    <main className={`flex-1 w-full flex flex-col mx-auto max-w-7xl px-4 sm:px-6 py-8 ${className}`}>
      {children}
    </main>
  );
}
