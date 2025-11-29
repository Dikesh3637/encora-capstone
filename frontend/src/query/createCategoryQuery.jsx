import axios from "axios";
import { API_PRODUCT_BASE_URL } from "./urls";

async function createCategory(categoryData) {
  const response = await axios.post(
    `${API_PRODUCT_BASE_URL}/category`,
    categoryData
  );

  return response.data;
}

export { createCategory };
