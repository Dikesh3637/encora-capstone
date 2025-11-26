package com.techademy.productcatalog.specification;

import com.techademy.productcatalog.entity.Product;
import com.techademy.productcatalog.entity.ProductSize;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

	public static Specification<Product> withFilters(String q, String category, String sizeStr, String gender,
			BigDecimal minPrice, BigDecimal maxPrice) {

		return (root, query, cb) -> {

			List<Predicate> predicates = new ArrayList<>();

			// Name
			if (q != null && !q.isBlank()) {
				predicates.add(cb.like(cb.lower(root.get("name")), "%" + q.toLowerCase() + "%"));
			}

			// Category
			if (category != null && !category.isBlank()) {
				predicates.add(cb.like(cb.lower(root.get("category")), "%" + category.toLowerCase() + "%"));
			}

			// Gender
			if (gender != null && !gender.isBlank()) {
				predicates.add(cb.equal(cb.lower(root.get("gender")), gender.toLowerCase()));
			}

			// Price >= minPrice
			if (minPrice != null) {
				predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
			}

			// Price <= maxPrice
			if (maxPrice != null) {
				predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
			}

			// Size
			if (sizeStr != null && !sizeStr.isBlank()) {
				ProductSize.Size enumSize;
				try {
					enumSize = ProductSize.Size.valueOf(sizeStr.toUpperCase());
				} catch (IllegalArgumentException ex) {
					enumSize = null;
				}
				if (enumSize != null) {
					query.distinct(true);
					Join<Product, ProductSize> sizesJoin = root.join("sizes", JoinType.INNER);
					predicates.add(cb.equal(sizesJoin.get("size"), enumSize));
				}
			}

			return cb.and(predicates.toArray(new Predicate[0]));
		};
	}
}
