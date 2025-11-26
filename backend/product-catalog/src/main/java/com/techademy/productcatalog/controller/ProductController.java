package com.techademy.productcatalog.controller;

import com.techademy.productcatalog.dto.CreateProductRequest;
import com.techademy.productcatalog.dto.ProductDto;
import com.techademy.productcatalog.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/products")
@Validated
public class ProductController {

	private final ProductService svc;

	public ProductController(ProductService svc) {
		this.svc = svc;
	}

	@PostMapping
	public ResponseEntity<ProductDto> create(@Valid @RequestBody CreateProductRequest req) {
		return ResponseEntity.status(201).body(svc.create(req));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductDto> get(@PathVariable Long id) {
		return ResponseEntity.ok(svc.getById(id));
	}

	@GetMapping
	public ResponseEntity<Page<ProductDto>> search(@RequestParam(required = false) String q,
			@RequestParam(required = false) String category,
			@RequestParam(required = false, name = "size") String sizeStr,
			@RequestParam(required = false) String gender, @RequestParam(required = false) BigDecimal minPrice,
			@RequestParam(required = false) BigDecimal maxPrice, @RequestParam(defaultValue = "0") int page,
			@RequestParam(name = "pageSize", defaultValue = "10") int pageSize) {

		return ResponseEntity.ok(svc.search(q, category, sizeStr, gender, minPrice, maxPrice, page, pageSize));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProductDto> update(@PathVariable Long id, @Valid @RequestBody CreateProductRequest req) {
		return ResponseEntity.ok(svc.update(id, req));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		svc.delete(id);
		return ResponseEntity.noContent().build();
	}
}
