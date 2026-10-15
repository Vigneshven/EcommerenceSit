"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import Button from "./Button";
import useFilterStore from "@/zustandStore/filterStore";
import {
  readProductFilters,
  writeProductFilters,
} from "@/lib/ProductSearchParam";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export type Inputs = {
  search: string;
  category: "all" | "beds" | "sofa" | "chairs";
  company: "all" | "Homeland" | "flix" | "comfoma";
  sortBy: "a-z" | "z-a" | "low-high" | "high-low";
  free_shipping: boolean;
  selling_price: number;
};

const schema = z.object({
  search: z.string(),
  category: z.enum(["all", "beds", "sofa", "chairs"]),
  company: z.enum(["all", "Homeland", "flix", "comfoma"]),
  sortBy: z.enum(["a-z", "z-a", "low-high", "high-low"]),
  free_shipping: z.boolean(),
  selling_price: z.number(),
});

function ProductFilterForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const { register, handleSubmit, reset, watch } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      search: "",
      category: "all",
      company: "all",
      sortBy: "a-z",
      selling_price: 4000,
      free_shipping: false,
    },
  });

  useEffect(() => {
    const filters = readProductFilters(new URLSearchParams(queryString));

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
      selling_price: filters.selling_price,
      free_shipping: filters.free_shipping,
    });
  }, [queryString, reset]);

  const selectedPrice = watch("selling_price");

  const setFilters = useFilterStore((state) => state.setFilters);

  const onSubmit = (data: Inputs) => {
    setFilters(data);

    const params = writeProductFilters(
      new URLSearchParams(searchParams.toString()),
      data,
    );

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const resetFilters = useFilterStore((state) => state.resetFilters);

  const onReset = () => {
    const defaults: Inputs = {
      search: "",
      category: "all",
      company: "all",
      sortBy: "a-z",
      selling_price: 4000,
      free_shipping: false,
    };
    reset(defaults);
    resetFilters();
    const params = writeProductFilters(
      new URLSearchParams(searchParams.toString()),
      defaults,
    );

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className="flex w-full justify-center items-center mt-10">
      <form
        className="w-full rounded-2xl bg-primary-light p-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-wrap gap-x-4 gap-y-10">
          <div className="basis-[calc(25%-12px)] flex flex-col">
            <label className="font-sans">Search Product</label>
            <input
              className="rounded-2xl border border-border bg-input-background p-2 text-heading"
              placeholder="Enter Product Name"
              {...register("search")}
            />
          </div>
          <div className="basis-[calc(25%-12px)] flex flex-col">
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
          <div className="basis-[calc(25%-12px)] flex flex-col">
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
          <div className="basis-[calc(25%-12px)] flex flex-col">
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
          <div className="basis-[calc(25%-12px)] flex flex-col">
            <label className="font-sans">Select Price {selectedPrice}</label>
            <input
              type="range"
              min={0}
              max={4000}
              {...register("selling_price", { valueAsNumber: true })}
            />
          </div>
          <div className="basis-[calc(25%-12px)] flex flex-col justify-center items-center">
            <label className="font-sans">Free Shipping</label>
            <input type="checkbox" {...register("free_shipping")} />
          </div>
          <Button type="submit" varient="primary">
            Search
          </Button>
          <Button type="submit" varient="primary" onClick={onReset}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProductFilterForm;
