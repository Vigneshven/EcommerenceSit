import Skeleton from "react-loading-skeleton";

export default function PageSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Skeleton height={40} width={250} className="mb-8" />

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        <section className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-5 border-b border-border pb-6"
            >
              <Skeleton width={128} height={128} borderRadius={12} />

              <div className="flex-1">
                <Skeleton width="65%" height={24} />
                <Skeleton width="35%" className="mt-3" />
                <Skeleton width={90} height={36} className="mt-5" />
              </div>
            </div>
          ))}
        </section>

        <aside>
          <Skeleton height={300} borderRadius={16} />
        </aside>
      </div>
    </main>
  );
}
