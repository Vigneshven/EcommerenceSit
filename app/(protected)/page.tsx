import FeaturedProduct from "@/components/FeaturedProduct";
import FeaturedProductsSkeleton from "@/components/FeaturedProductSkeleton";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="w-full max-w-7xl px-6 mx-auto">
      <div className="flex items-center justify-between gap-10 py-12">
        <div className="flex max-w-xl flex-col items-start gap-10">
          <p className="w-full text-5xl font-extrabold text-text-light">
            We are changing <br />
            the way people <br />
            shop
          </p>
          <p className="w-full text-text-light">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            <br />
            Tempore repellat explicabo enim soluta temporibus asperiores <br />
            aut obcaecati perferendis porro nobis.
          </p>
          <button className="hover:cursor-pointer rounded-2xl bg-primary p-4 font-bold text-on-primary">
            OUR PRODUCT
          </button>
        </div>
        <div className="flex w-1/2 gap-3 rounded-3xl bg-primary-dark">
          <Image
            className="border-8  rounded-3xl h-110 min-w-0 flex-7 object-cover"
            src="https://react-vite-comfy-store-v2.netlify.app/assets/hero1-deae5a1f.webp"
            alt="sofa"
            width={300}
            height={400}
            loading="eager"
          />
          <Image
            className="border-b-8 border-l-8 border-t-8 rounded-3xl h-110 min-w-0 flex-3 object-cover"
            src="https://react-vite-comfy-store-v2.netlify.app/assets/hero2-2271e3ad.webp"
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
