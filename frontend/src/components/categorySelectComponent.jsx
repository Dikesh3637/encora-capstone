import { useQuery } from "@tanstack/react-query";
import { fetchCategoryList } from "../query/getCategoryListQuery";
import MultiSelectDropdown from "./multiSelectDropDownComponent";
import { useProductFilter } from "../provider/ProductFilterProvider";

function CategorySelectComponent() {
  const { setCategory } = useProductFilter();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoryList,
  });

  const options = data ? data.map((category) => category.name) : [];
  console.log(options);

  const setCategoryId = (categoryArray) => {
    const categoryIds = data
      .filter((category) => categoryArray.includes(category.name))
      .map((category) => category.id);
    setCategory(categoryIds);
  };

  return (
    <>
      {isLoading && <div className="btn btn-ghost">Loading...</div>}
      {isError && (
        <div className="btn btn-ghost">Error fetching categories</div>
      )}
      {data && (
        <MultiSelectDropdown
          placeholder="category"
          options={options}
          onChange={setCategoryId}
        />
      )}
    </>
  );
}

export default CategorySelectComponent;
