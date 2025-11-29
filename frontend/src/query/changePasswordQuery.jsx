import axios from "axios";
import { API_AUTH_BASE_URL } from "./urls";

export const changePassword = async ({ oldPassword, newPassword }) => {
  const response = await axios.post(`${API_AUTH_BASE_URL}/change-password`, {
    oldPassword,
    newPassword,
  });
  return response.data;
};
