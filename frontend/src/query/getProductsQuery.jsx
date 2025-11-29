import axios from "axios";
import { API_PRODUCT_BASE_URL } from "./urls";

export const fetchProducts = async ({ pageParam = 0, filters }) => {
  const params = new URLSearchParams();

  params.append("page", pageParam);
  params.append("size", "11");

  if (filters.sortBy) {
    params.append("sort", filters.sortBy);
  }

  if (filters.category && filters.category.length > 0) {
    filters.category.forEach((catId) => {
      params.append("category", catId);
    });
  }

  if (filters.gender) params.append("gender", filters.gender);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
  if (filters.searchQuery) params.append("search", filters.searchQuery);

  params.append("inStockOnly", filters.inStockOnly);

  const response = await axios.get(API_PRODUCT_BASE_URL, { params });
  return response.data;
};
