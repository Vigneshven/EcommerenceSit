import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import Button from "./Button";
import useFilterStore from "../zustandStore/filterStore";

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

  const setFilters = useFilterStore((state) => state.setFilters);

  const onSubmit = (data: Inputs) => {
    setFilters(data)};

  const resetFilters = useFilterStore((state) => state.resetFilters);

  const onReset = () => {
    reset({
      search: "",
      category: "all",
      company: "all",
      sortBy: "a-z",
      selling_price: 4000,
      free_shipping: false,
    });
    resetFilters();
  };

  const selectedPrice = watch("selling_price");

  return (
    <div className="mt-10 flex w-full items-center justify-center">
      <form
        className="w-full rounded-2xl bg-primary-light p-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-10">
          <div className="basis-[calc(25%-12px)] flex flex-col">
            <label className="font-sans">Search Product</label>
            <input
              className="rounded-2xl border border-border bg-input-background p-2 text-heading"
              {...register("search")}
              placeholder="search product"
            />
          </div>

          <div className="basis-[calc(25%-12px)] flex flex-col">
            <label>Select Category</label>

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
            <label>Select Company</label>

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
            <label>Select Price {selectedPrice}</label>
            <input
              type="range"
              min={0}
              max={5000}
              {...register("selling_price", { valueAsNumber: true })}
            />
          </div>

          <div className="basis-[calc(25%-12px)] flex flex-col justify-center items-center">
            <label>Free Shipping</label>
            <input type="checkbox" {...register("free_shipping")} />
          </div>

          <Button type="submit" varient="primary">
            Search
          </Button>

          <Button type="button" onClick={onReset} varient="reset">
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProductFilterForm;
