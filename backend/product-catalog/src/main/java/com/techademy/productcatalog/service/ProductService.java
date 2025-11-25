package com.techademy.productcatalog.service;

import com.techademy.productcatalog.dto.*;
import com.techademy.productcatalog.entity.Product;
import com.techademy.productcatalog.exception.NotFoundException;
import com.techademy.productcatalog.repository.ProductRepository;
import com.techademy.productcatalog.util.ProductMapper;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        return repo.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new NotFoundException("Product not found: " + id));
    }

    public Page<ProductDto> search(String q, String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Product> pageData;

        if (category != null && !category.isBlank())
            pageData = repo.findByCategoryContainingIgnoreCase(category, pageable);
        else if (q != null && !q.isBlank())
            pageData = repo.findByNameContainingIgnoreCase(q, pageable);
        else
            pageData = repo.findAll(pageable);

        return pageData.map(mapper::toDto);
    }

    public ProductDto update(Long id, CreateProductRequest req) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found: " + id));

        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setCategory(req.getCategory());
        p.setStock(req.getStock());
        p.setImageUrl(req.getImageUrl());

        return mapper.toDto(repo.save(p));
    }

    public void delete(Long id) {
        if (!repo.existsById(id))
            throw new NotFoundException("Product not found: " + id);

        repo.deleteById(id);
    }
}
