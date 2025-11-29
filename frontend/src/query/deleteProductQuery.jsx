import axios from "axios";
import { API_PRODUCT_BASE_URL } from "./urls";

export default async function deleteProduct(productId) {
  const response = await axios.delete(`${API_PRODUCT_BASE_URL}/${productId}`);
  return response.data;
}
