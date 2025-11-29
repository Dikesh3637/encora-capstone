import axios from "axios";
import { API_PRODUCT_BASE_URL } from "./urls";

export const fetchProductById = async (id) => {
  const response = await axios.get(`${API_PRODUCT_BASE_URL}/${id}`);
  return response.data;
};
