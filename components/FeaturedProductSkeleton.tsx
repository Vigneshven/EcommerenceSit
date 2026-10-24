import Skeleton from "react-loading-skeleton";

export default function FeaturedProductsSkeleton() {
  return (
    <section>
      <Skeleton height={32} width={240} className="mb-5" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <Skeleton height={220} />
            <Skeleton height={22} className="mt-3" />
            <Skeleton height={20} width="50%" />
          </div>
        ))}
      </div>
    </section>
  );
}
