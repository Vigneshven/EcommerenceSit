
import Button from "@/components/Button";
import FeaturedProduct from "@/components/FeaturedProduct";
import FeaturedProductsSkeleton from "@/components/FeaturedProductSkeleton";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="w-full max-w-7xl px-6 mx-auto">
      <div className="flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="flex max-w-xl flex-col items-start gap-6 sm:gap-10">
          <p className="w-full text-3xl font-extrabold text-text-light sm:text-4xl md:text-5xl">
            We are changing <br className="hidden md:inline" />
            the way people <br className="hidden md:inline" />
            shop
          </p>
          <p className="w-full text-text-light">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.{" "}
            <br className="hidden md:inline" />
            Tempore repellat explicabo enim soluta temporibus asperiores{" "}
            <br className="hidden md:inline" />
            aut obcaecati perferendis porro nobis.
          </p>
          <Button className="basis-auto hover:cursor-pointer rounded-2xl bg-primary p-4 font-bold text-on-primary">
            OUR PRODUCT
          </Button>
        </div>
        <div className="flex w-full gap-3 rounded-3xl bg-primary-dark md:w-1/2">
          <Image
            className="border-8  rounded-3xl h-64 min-w-0 flex-7 object-cover sm:h-80 md:h-110"
            src="/sofa.jpg"
            alt="sofa"
            width={300}
            height={400}
            loading="eager"
          />
          <Image
            className="border-b-8 border-l-8 border-t-8 rounded-3xl h-64 min-w-0 flex-3 object-cover sm:h-80 md:h-110"
            src="/chair.jpg"
            alt="sofa"
            width={300}
            height={400}
            loading="eager"
          />
        </div>
      </div>

      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProduct />
      </Suspense>
    </div>
  );
}
