export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 overflow-hidden shadow-sm">
      <div className="h-52 bg-slate-100 dark:bg-slate-700 animate-pulse" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 w-1/3 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
        <div className="h-3 w-1/4 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
        <div className="mt-2 flex justify-between">
          <div className="h-6 w-16 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
          <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
