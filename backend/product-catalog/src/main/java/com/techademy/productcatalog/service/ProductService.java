package com.techademy.productcatalog.service;

import com.techademy.productcatalog.dto.CreateProductRequest;
import com.techademy.productcatalog.dto.ProductDto;
import com.techademy.productcatalog.entity.Product;
import com.techademy.productcatalog.entity.ProductSize;
import com.techademy.productcatalog.exception.NotFoundException;
import com.techademy.productcatalog.repository.ProductRepository;
import com.techademy.productcatalog.specification.ProductSpecification;
import com.techademy.productcatalog.util.ProductMapper;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class ProductService {

	private final ProductRepository repo;
	private final ProductMapper mapper = new ProductMapper();

	public ProductService(ProductRepository repo) {
		this.repo = repo;
	}

	public ProductDto create(CreateProductRequest req) {
		Product p = mapper.fromCreateRequest(req);
		p = repo.save(p);
		return mapper.toDto(p);
	}

	public ProductDto getById(Long id) {
		return repo.findById(id).map(mapper::toDto)
				.orElseThrow(() -> new NotFoundException("Product not found: " + id));
	}

	public Page<ProductDto> search(String q, String category, String sizeStr, String gender, BigDecimal minPrice,
			BigDecimal maxPrice, int page, int pageSize) {

		Pageable pageable = PageRequest.of(page, pageSize);

		if (sizeStr != null && !sizeStr.isBlank()) {
			try {
				ProductSize.Size.valueOf(sizeStr.toUpperCase());
			} catch (IllegalArgumentException ex) {
				throw new NotFoundException("Invalid size: " + sizeStr + ". Allowed: S, M, L, XL, XXL");
			}
		}

		Specification<Product> spec = ProductSpecification.withFilters(q, category, sizeStr, gender, minPrice,
				maxPrice);

		Page<Product> pageData = repo.findAll(spec, pageable);

		return pageData.map(mapper::toDto);
	}

	public ProductDto update(Long id, CreateProductRequest req) {
		Product p = repo.findById(id).orElseThrow(() -> new NotFoundException("Product not found: " + id));

		p.setName(req.getName());
		p.setDescription(req.getDescription());
		p.setPrice(req.getPrice());
		p.setCategory(req.getCategory());
		p.setGender(req.getGender());
		p.setImageUrl(req.getImageUrl());

		p.getSizes().clear();
		if (req.getSizeStock() != null) {
			req.getSizeStock().forEach((sizeStr, stock) -> {
				ProductSize.Size sizeEnum = ProductSize.Size.valueOf(sizeStr);
				p.getSizes().add(new ProductSize(p, sizeEnum, stock));
			});
		}

		return mapper.toDto(repo.save(p));
	}

	public void delete(Long id) {
		if (!repo.existsById(id)) {
			throw new NotFoundException("Product not found: " + id);
		}
		repo.deleteById(id);
	}
}
