"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import Button from "./Button";
import useFilterStore from "@/zustandStore/filterStore";
import {
  getDefaultFilters,
  readProductFilters,
  writeProductFilters,
  type ProductPriceBounds,
} from "@/lib/ProductSearchParam";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils/price";
import { useThrottle } from "@/lib/utils/throttle";

export type Inputs = {
  search: string;
  category: "all" | "beds" | "sofa" | "chairs";
  company: "all" | "Homeland" | "flix" | "comfoma";
  sortBy: "a-z" | "z-a" | "low-high" | "high-low";
  free_shipping: boolean;
  minPrice: number;
  maxPrice: number;
};

const schema = z
  .object({
    search: z.string(),
    category: z.enum(["all", "beds", "sofa", "chairs"]),
    company: z.enum(["all", "Homeland", "flix", "comfoma"]),
    sortBy: z.enum(["a-z", "z-a", "low-high", "high-low"]),
    free_shipping: z.boolean(),
    minPrice: z.number(),
    maxPrice: z.number(),
  })
  .refine((data) => data.minPrice <= data.maxPrice, {
    message: "Min price must be less than max price",
    path: ["minPrice"],
  });

type Props = {
  priceBounds: ProductPriceBounds;
};

function ProductFilterForm({ priceBounds }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const defaults = getDefaultFilters(priceBounds);

  const { control, register, handleSubmit, reset, setValue, getValues } =
    useForm<Inputs>({
      resolver: zodResolver(schema),
      defaultValues: defaults as Inputs,
    });

  useEffect(() => {
    const filters = readProductFilters(
      new URLSearchParams(queryString),
      priceBounds,
    );

    reset({
      search: filters.search,
      category: ["all", "beds", "sofa", "chairs"].includes(filters.category)
        ? (filters.category as Inputs["category"])
        : "all",
      company: ["all", "Homeland", "flix", "comfoma"].includes(filters.company)
        ? (filters.company as Inputs["company"])
        : "all",
      sortBy: ["a-z", "z-a", "low-high", "high-low"].includes(filters.sortBy)
        ? (filters.sortBy as Inputs["sortBy"])
        : "a-z",
      free_shipping: filters.free_shipping,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });
  }, [queryString, reset, priceBounds]);

  const minPrice =
    useWatch({ control, name: "minPrice" }) ?? priceBounds.minPrice;
  const maxPrice =
    useWatch({ control, name: "maxPrice" }) ?? priceBounds.maxPrice;

  const throttledApplyPrice = useThrottle((min: number, max: number) => {
    const data = getValues();
    const params = writeProductFilters(
      new URLSearchParams(searchParams.toString()),
      { ...data, minPrice: min, maxPrice: max },
      priceBounds,
    );
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, 200);

  const setFilters = useFilterStore((state) => state.setFilters);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const onSubmit = (data: Inputs) => {
    setFilters(data);

    const params = writeProductFilters(
      new URLSearchParams(searchParams.toString()),
      data,
      priceBounds,
    );

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const onReset = () => {
    const resetDefaults = getDefaultFilters(priceBounds) as Inputs;
    reset(resetDefaults);
    resetFilters();
    const params = writeProductFilters(
      new URLSearchParams(searchParams.toString()),
      resetDefaults,
      priceBounds,
    );

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className="mt-10 flex w-full items-center justify-center">
      <form
        className="w-full rounded-2xl bg-primary-light p-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-wrap gap-x-4 gap-y-10">
          <div className="flex basis-[calc(25%-12px)] flex-col">
            <label className="font-sans">Search Product</label>
            <input
              className="rounded-2xl border border-border bg-input-background p-2 text-heading"
              placeholder="Enter Product Name"
              {...register("search")}
            />
          </div>
          <div className="flex basis-[calc(25%-12px)] flex-col">
            <label className="font-sans">Select Category</label>
            <select
              className="rounded-2xl border border-border bg-input-background p-2 text-heading"
              {...register("category")}
            >
              <option value="all">all</option>
              <option value="beds">beds</option>
              <option value="sofa">sofa</option>
              <option value="chairs">chairs</option>
            </select>
          </div>
          <div className="flex basis-[calc(25%-12px)] flex-col">
            <label className="font-sans">Select Company</label>
            <select
              className="rounded-2xl border border-border bg-input-background p-2 text-heading"
              {...register("company")}
            >
              <option value="all">all</option>
              <option value="Homeland">Homeland</option>
              <option value="flix">flix</option>
              <option value="comfoma">comfoma</option>
            </select>
          </div>
          <div className="flex basis-[calc(25%-12px)] flex-col">
            <label>SortBy</label>
            <select
              className="rounded-2xl border border-border bg-input-background p-2 text-heading"
              {...register("sortBy")}
            >
              <option value="a-z">a-z</option>
              <option value="z-a">z-a</option>
              <option value="low-high">low-high</option>
              <option value="high-low">high-low</option>
            </select>
          </div>
          <div className="flex basis-[calc(25%-12px)] flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="font-sans">Price Range</label>
              <span className="text-sm font-medium text-heading">
                {formatPrice(minPrice)} - {formatPrice(maxPrice)}
              </span>
            </div>
            <div className="relative h-6">
              <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-border" />
              <div
                className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary"
                style={{
                  left: `${((minPrice - priceBounds.minPrice) / Math.max(priceBounds.maxPrice - priceBounds.minPrice, 1)) * 100}%`,
                  right: `${100 - ((maxPrice - priceBounds.minPrice) / Math.max(priceBounds.maxPrice - priceBounds.minPrice, 1)) * 100}%`,
                }}
              />
              <input
                type="range"
                min={priceBounds.minPrice}
                max={priceBounds.maxPrice}
                step={1}
                value={minPrice}
                onChange={(e) => {
                  const value = Math.min(Number(e.target.value), maxPrice);
                  setValue("minPrice", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  throttledApplyPrice(value, maxPrice);
                }}
                className="range-input"
              />
              <input
                type="range"
                min={priceBounds.minPrice}
                max={priceBounds.maxPrice}
                step={1}
                value={maxPrice}
                onChange={(e) => {
                  const value = Math.max(Number(e.target.value), minPrice);
                  setValue("maxPrice", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  throttledApplyPrice(minPrice, value);
                }}
                className="range-input"
              />
            </div>
          </div>
          <div className="flex basis-[calc(25%-12px)] flex-col items-center justify-center">
            <label className="font-sans">Free Shipping</label>
            <input type="checkbox" {...register("free_shipping")} />
          </div>
          <Button type="submit" varient="primary">
            Search
          </Button>
          <Button type="button" varient="reset" onClick={onReset}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProductFilterForm;
