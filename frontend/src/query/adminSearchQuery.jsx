import axios from "axios";
import { API_PRODUCT_BASE_URL } from "./urls";

export const adminSearchProducts = async (searchParams) => {
  const params = new URLSearchParams();

  if (searchParams.query) {
    params.append("query", searchParams.query);
  }
  if (searchParams.productId) {
    params.append("productId", searchParams.productId);
  }

  params.append("page", searchParams.page || "0");
  params.append("size", searchParams.size || "12");

  const response = await axios.get(`${API_PRODUCT_BASE_URL}/admin/search`, {
    params,
  });

  return response.data;
};
