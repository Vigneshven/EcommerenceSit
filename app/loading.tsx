import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6">
      <section className="flex items-center justify-between gap-10 py-12">
        <div className="flex w-1/2 flex-col gap-8">
          <Skeleton height={55} width="95%" count={3} />
          <Skeleton height={20} count={3} />
          <Skeleton height={55} width={160} borderRadius={16} />
        </div>
        <div className="flex w-1/2 gap-3">
          <div className="flex-7">
            <Skeleton height={440} borderRadius={24} />
          </div>
          <div className="flex-3">
            <Skeleton height={440} borderRadius={24} />
          </div>
        </div>
      </section>
      <section className="py-8">  
        <Skeleton width={220} height={35} className="mb-6" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <Skeleton height={220} borderRadius={12} />
              <Skeleton width="70%" className="mt-3" />
              <Skeleton width="40%" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
