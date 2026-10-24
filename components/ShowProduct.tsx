"use client";

import { readProductFilters } from "@/lib/ProductSearchParam";
import { Product } from "@/type/Product";
import useProductStore from "@/zustandStore/ProductStore";
import { Grid2X2, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface ShowProductProps {
  initialProducts: Product[];
}

const PRODUCTS_PER_PAGE = 9;

function getPrice(price: string | number): number {
  return typeof price === "number"
    ? price
    : Number(price.replace(/[^0-9.]/g, ""));
}

export default function ShowProduct({ initialProducts }: ShowProductProps) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<"grid" | "list">("grid");

  const cachedProduct = useProductStore((state) => state.product);

  const setProduct = useProductStore((state) => state.setProducts);

  const product = cachedProduct.length > 0 ? cachedProduct : initialProducts;

  const filters = useMemo(
    () => readProductFilters(new URLSearchParams(queryString)),
    [queryString],
  );

  useEffect(() => {
    if (cachedProduct.length === 0 && initialProducts.length > 0) {
      setProduct(initialProducts);
    }
  }, [cachedProduct.length, initialProducts, setProduct]);

  const filterProducts = useMemo(() => {
    let result = [...product];

    if (filters.search.trim()) {
      const search = filters.search.trim().toLowerCase();

      result = result.filter((product) =>
        product.name.toLowerCase().includes(search),
      );
    }

    if (filters.category !== "all") {
      result = result.filter(
        (product) => product.category === filters.category,
      );
    }

    if (filters.company !== "all") {
      result = result.filter((product) => product.company === filters.company);
    }

    result = result.filter(
      (product) => getPrice(product.price) <= filters.selling_price,
    );

    if (filters.free_shipping) {
      result = result.filter((product) => product.free_shipping);
    }

    switch (filters.sortBy) {
      case "a-z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-a":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "low-high":
        result.sort((a, b) => getPrice(a.price) - getPrice(b.price));
        break;
      case "high-low":
        result.sort((a, b) => getPrice(b.price) - getPrice(a.price));
        break;
    }

    return result;
  }, [product, filters]);

  const [previousQuery, setPreviousQuery] = useState(queryString);

  if (previousQuery !== queryString) {
    setPreviousQuery(queryString);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(filterProducts.length / PRODUCTS_PER_PAGE);

  const safePage = Math.min(currentPage, Math.max(totalPages, 1));

  const currentProducts = filterProducts.slice(
    (safePage - 1) * PRODUCTS_PER_PAGE,
    safePage * PRODUCTS_PER_PAGE,
  );

  if (filterProducts.length === 0) {
    return <p className="mt-8 text-center">No products found.</p>;
  }

  return (
    <>
      <div className="mt-8 flex w-full items-center justify-between">
        <div>
          <h4>{filterProducts.length} Product</h4>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={
              view === "grid"
                ? "rounded-lg bg-primary p-1 text-on-primary"
                : "rounded-lg p-1 text-heading hover:bg-hover-background"
            }
          >
            <Grid2X2 />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={
              view === "list"
                ? "rounded-lg bg-primary p-1 text-on-primary"
                : "rounded-lg p-1 text-heading hover:bg-hover-background"
            }
          >
            <Menu />
          </button>
        </div>
      </div>

      <div className="flex flex-1 justify-center items-center mt-4">
        <hr className="w-full border-primary-light border-t-2" />
      </div>

      <div
        className={
          view === "grid"
            ? "grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col gap-5"
        }
      >
        {currentProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className={`cursor-pointer overflow-hidden rounded-xl border border-border bg-card-background shadow transition hover:bg-hover-background hover:shadow-lg
                            ${view === "grid" ? "" : "flex items-center gap-3 p-4"}
                            
                            `}
          >
            <Image
              className={
                view === "grid"
                  ? "h-56 w-full object-cover"
                  : "h-28 w-28 shrink-0 rounded-lg object-cover"
              }
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
              loading="eager"
            />

            <div
              className={
                view === "grid"
                  ? "flex flex-col items-center justify-center p-4"
                  : "flex min-w-0 flex-1 items-center justify-between gap-4"
              }
            >
              <div className={view === "grid" ? "" : "min-w-0"}>
                <h2 className="text-lg font-semibold text-heading">
                  {product.name}
                </h2>

                {view === "list" && (
                  <p className="mt-1 text-sm text-muted-text">
                    {product.company}
                  </p>
                )}
              </div>

              <span className="mt-2 block shrink-0 font-medium text-primary">
                {product.price}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex w-full flex-wrap justify-end gap-3">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            className="rounded-lg bg-primary-light px-4 py-2 text-heading hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            PREV
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg px-4 py-2 ${
                  currentPage === page
                    ? "bg-primary text-on-primary"
                    : "bg-primary-light text-heading hover:bg-primary hover:text-on-primary"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="rounded-lg bg-primary-light px-4 py-2 text-heading hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            NEXT
          </button>
        </div>
      )}
    </>
  );
}
