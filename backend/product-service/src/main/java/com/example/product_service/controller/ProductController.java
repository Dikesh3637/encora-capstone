package com.example.product_service.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.product_service.dto.CreateCategoryDto;
import com.example.product_service.dto.CreateProductDto;
import com.example.product_service.entity.Category;
import com.example.product_service.entity.Product;
import com.example.product_service.enums.Gender;
import com.example.product_service.service.ProductService;

@RestController
public class ProductController {

        @Autowired
        private ProductService productService;

        @GetMapping("/")
        public ResponseEntity<Page<Product>> getProducts(
                        @RequestParam(value = "category", required = false) List<Long> category,
                        @RequestParam(value = "gender", required = false) Gender gender,
                        @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
                        @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
                        @RequestParam(value = "inStockOnly", required = false, defaultValue = "false") Boolean inStockOnly,
                        @RequestParam(value = "search", required = false) String search,
                        @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
                Page<Product> products = productService.getFilteredProducts(
                                category,
                                gender,
                                minPrice,
                                maxPrice,
                                inStockOnly,
                                search,
                                pageable);

                return ResponseEntity.ok(products);
        }

        @GetMapping("/{id}")
        public ResponseEntity<Product> getProductById(@PathVariable(value = "id", required = true) Long id) {
                Product product = productService.getProductById(id);
                return ResponseEntity.ok(product);
        }

        @PostMapping(value = "/", consumes = "multipart/form-data")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<?> createProduct(
                        @RequestPart("product") CreateProductDto productDto,
                        @RequestPart("image") MultipartFile image) {

                Product product = productService.createProduct(productDto, image);

                return ResponseEntity.ok()
                                .body(Map.of(
                                                "success", true,
                                                "productId", product.getId(),
                                                "imageUrl", product.getUrl(),
                                                "message", "Product created successfully!"));
        }

        @PostMapping("/category")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<?> createCategory(@RequestBody CreateCategoryDto categoryDto) {

                Category category = productService.createCategory(categoryDto);

                return ResponseEntity.status(201)
                                .body(Map.of(
                                                "success", true,
                                                "categoryId", category.getId(),
                                                "name", category.getName(),
                                                "message", "Category created successfully!"));

        }

        @GetMapping("/admin/search")
        public ResponseEntity<?> adminSearch(
                        @RequestParam(value = "productId", required = false) Long productId,
                        @RequestParam(value = "query", required = false) String query,
                        @PageableDefault(size = 12, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

                if (productId != null) {
                        Product product = productService.getProductById(productId);
                        return ResponseEntity.ok(List.of(product));
                }

                Page<Product> products = productService.getFilteredProducts(
                                null,
                                null,
                                null,
                                null,
                                false,
                                query,
                                pageable);

                return ResponseEntity.ok(products.getContent());
        }

        @PutMapping(value = "/{id}", consumes = "multipart/form-data")
        public ResponseEntity<?> updateProduct(
                        @PathVariable(value = "id", required = true) Long id,
                        @RequestPart(value = "product", required = true) CreateProductDto productDto,
                        @RequestPart(value = "image", required = false) MultipartFile image) {

                Product updatedProduct = productService.updateProduct(id, productDto, image);
                return ResponseEntity.ok(updatedProduct);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteProduct(
                        @PathVariable(value = "id", required = true) Long id) {

                productService.deleteProduct(id);
                return ResponseEntity.ok(Map.of(
                                "success", true,
                                "message", "Product deleted successfully!"));
        }

}
