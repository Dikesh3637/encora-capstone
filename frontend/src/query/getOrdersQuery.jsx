import axios from "axios";
import { API_ORDER_BASE_URL } from "./urls";
export const fetchUserOrders = async () => {
  const response = await axios.get(`${API_ORDER_BASE_URL}`, {
    withCredentials: true,
  });
  return response.data;
};
