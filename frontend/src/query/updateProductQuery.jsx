import axios from "axios";
import { API_PRODUCT_BASE_URL } from "./urls";

export const updateProduct = async ({ id, formData }) => {
  const response = await axios.put(`${API_PRODUCT_BASE_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
