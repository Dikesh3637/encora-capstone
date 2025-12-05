import axios from "axios";
import { API_ORDER_BASE_URL } from "./urls";

/**
 * Places a direct order for a single item.
 * Expected payload: { productId, productVariantId, productName, size, price, quantity }
 */
export const placeOrder = async (orderData) => {
  const response = await axios.post(`${API_ORDER_BASE_URL}`, orderData, {
    withCredentials: true,
  });
  return response.data;
};
