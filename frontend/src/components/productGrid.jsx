import { useInView } from "react-intersection-observer";
import { useProductsInfinite } from "../hook/useProductInfinite";
import { useProductFilter } from "../provider/ProductFilterProvider";
import ProductCard from "./ProductCard";
import { useEffect } from "react";
import React from "react";

function ProductDisplayGrid() {
  const { state: filters } = useProductFilter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useProductsInfinite(filters);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error: {error.message}</div>;

  console.log("productdata ::", data);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div ref={ref} style={{ textAlign: "center", margin: "20px" }}>
        {isFetchingNextPage ? (
          <p>Loading more...</p>
        ) : hasNextPage ? (
          <button onClick={() => fetchNextPage()}>Load More</button>
        ) : (
          <p>No more products to load</p>
        )}
      </div>
    </>
  );
}

export default ProductDisplayGrid;
