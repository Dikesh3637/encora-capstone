import axios from "axios";
import { API_PRODUCT_BASE_URL } from "./urls";

async function createProduct(formData) {
  const submitData = new FormData();

  submitData.append(
    "product",
    new Blob(
      [
        JSON.stringify({
          name: formData.name,
          description: formData.description,
          gender: formData.gender,
          categoryId: formData.categoryId,
          price: parseFloat(formData.price),
          sizes: formData.sizes,
        }),
      ],
      { type: "application/json" }
    )
  );

  if (formData.image) {
    submitData.append("image", formData.image);
  }

  const response = await axios.post(API_PRODUCT_BASE_URL, submitData);

  return response.data;
}

export { createProduct };
