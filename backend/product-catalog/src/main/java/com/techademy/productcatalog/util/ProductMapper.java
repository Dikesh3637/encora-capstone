package com.techademy.productcatalog.util;

import com.techademy.productcatalog.dto.CreateProductRequest;
import com.techademy.productcatalog.dto.ProductDto;
import com.techademy.productcatalog.entity.Product;
import com.techademy.productcatalog.entity.ProductSize;

import java.util.Map;
import java.util.stream.Collectors;

public class ProductMapper {

	public ProductDto toDto(Product p) {
		Map<String, Integer> sizeStock = p.getSizes().stream()
				.collect(Collectors.toMap(ps -> ps.getSize().name(), ProductSize::getStock));

		return new ProductDto(p.getId(), p.getName(), p.getDescription(), p.getPrice(), p.getCategory(), sizeStock,
				p.getRating(), p.getImageUrl(), p.getGender());
	}

	public Product fromCreateRequest(CreateProductRequest r) {
		Product p = new Product();
		p.setName(r.getName());
		p.setDescription(r.getDescription());
		p.setPrice(r.getPrice());
		p.setCategory(r.getCategory());
		p.setGender(r.getGender());
		p.setImageUrl(r.getImageUrl());

		p.getSizes().clear();
		if (r.getSizeStock() != null) {
			r.getSizeStock().forEach((sizeStr, stock) -> {
				ProductSize.Size size = ProductSize.Size.valueOf(sizeStr);
				p.getSizes().add(new ProductSize(p, size, stock));
			});
		}
		return p;
	}
}
