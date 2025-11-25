package com.techademy.productcatalog.util;

import com.techademy.productcatalog.dto.ProductDto;
import com.techademy.productcatalog.dto.CreateProductRequest;
import com.techademy.productcatalog.entity.Product;

public class ProductMapper {

    public ProductDto toDto(Product p) {
        return new ProductDto(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getCategory(),
                p.getStock(),
                p.getRating(),
                p.getImageUrl()
        );
    }

    public Product fromCreateRequest(CreateProductRequest r) {
        Product p = new Product();
        p.setName(r.getName());
        p.setDescription(r.getDescription());
        p.setPrice(r.getPrice());
        p.setCategory(r.getCategory());
        p.setStock(r.getStock());
        p.setImageUrl(r.getImageUrl());
        return p;
    }
}
